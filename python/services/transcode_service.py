import threading
import os
import sys
import tempfile
import subprocess
import shutil

from typing import List
from data.transcode_settings import TranscodeSettings
from services.job_service import JobService
from services.task_service import TaskService
from model.ingest.job_model import JobType
from settings.settings_service import SettingsService, SettingsEnum
from data.task import TaskStatus

from utils.file_path import extract_catalog_folder_info, construct_catalog_folder_path
from utils.prints import print_out, print_err
from utils.numbers import find_closest

class TranscodeService:

    HEIGHT_STEPS = [2160, 1080, 540, 270]
    BANDWIDTH_STEPS = [20_000, 6_000, 2_000, 400]

    def __init__(self):
        self.job_service = JobService()
        self.task_service = TaskService()
        self.settings_service = SettingsService()

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.ffmpeg_path = os.path.join(base_dir, 'resources', 'ffmpeg.exe')
        self.mp4box_path = os.path.join(base_dir, 'resources', 'mp4box.exe')

    def start_transcode_job(self, source_dir: str, transcode_settings_list: List[TranscodeSettings]) -> int:

        transcode_job_id = self.job_service.create_job(JobType.TRANSCODE)

        transcode_task_ids = []
        for transcode_settings_json in transcode_settings_list:
            transcode_settings = TranscodeSettings(**transcode_settings_json)
            transcode_task_id = self.task_service.create_task(transcode_job_id, transcode_settings)
            transcode_task_ids.append(transcode_task_id)

        threading.Thread(target=self.transcode_videos, args=(source_dir, transcode_task_ids,)).start()

        return transcode_job_id

    def restart_transcode_job(self, job_id: int, source_dir: str) -> int:
        failed_transcode_task_ids = self.task_service.get_all_task_ids_by_status(job_id, TaskStatus.PENDING)
        failed_transcode_task_ids.extend(self.task_service.get_all_task_ids_by_status(job_id, TaskStatus.ERROR))

        threading.Thread(target=self.transcode_videos, args=(source_dir, failed_transcode_task_ids,)).start()

        return job_id

    def transcode_videos(self, source_dir, transcode_task_ids: List[int]):   
        optimized_base_dir = self.settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)
        original_base_dir = self.settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_ORIGINAL_VIDEOS.value)

        source_dir_name = os.path.basename(source_dir)
        # NOTE TO MATT: you should be able to dump catalog_folder_info directly into TblCatalogFolder
        catalog_folder_info = extract_catalog_folder_info(source_dir_name)
        optimized_dir_path = construct_catalog_folder_path(optimized_base_dir, *catalog_folder_info)
        original_dir_path = construct_catalog_folder_path(original_base_dir, *catalog_folder_info)

        os.makedirs(optimized_dir_path, exist_ok=True)
        os.makedirs(original_dir_path, exist_ok=True)

        for transcode_task_id in transcode_task_ids:
            with tempfile.TemporaryDirectory() as temp_dir:
                try:
                    transcode_settings = self.task_service.get_transcode_settings(transcode_task_id)
                    original_file = transcode_settings.file_path

                    # Determine the Adaptive Bitrate Ladder for this video
                    input_height = transcode_settings.input_height
                    max_height = find_closest(self.HEIGHT_STEPS, input_height)
                    max_height_idx = self.HEIGHT_STEPS.index(max_height)
                    heights_to_use = self.HEIGHT_STEPS[max_height_idx:]
                    bandwidths_to_use = self.BANDWIDTH_STEPS[max_height_idx:]

                    # Prepare filepath variables
                    shared_extension = '.mp4'
                    original_file_name = os.path.splitext(os.path.basename(original_file))[0]
                    temp_files = [
                        os.path.join(temp_dir, f'{original_file_name}_{height}{shared_extension}')
                        for height in heights_to_use
                    ]
                    temp_dash_container = os.path.join(temp_dir, original_file_name)
                    temp_mpd_file = os.path.join(temp_dash_container, f'{original_file_name}.mpd')
                    os.makedirs(temp_dash_container, exist_ok=True)

                    # Transcode the video into multiple intermediates
                    output_framerate = transcode_settings.output_framerate
                    keyframe_rate = output_framerate * 2
                    for index, output_height in enumerate(heights_to_use):
                        bandwidth = bandwidths_to_use[index]
                        temp_file = temp_files[index]
                        ffmpeg_command = [
                            self.ffmpeg_path,
                            '-y',
                            '-i', original_file,
                            '-c:v', 'libx264',
                            '-x264opts', f'keyint={keyframe_rate}:min-keyint={keyframe_rate}:no-scenecut',
                            '-r', str(output_framerate),
                            '-vf', f'scale=-2:{output_height}',
                            '-pix_fmt', 'yuv420p',
                            '-b:v', f'{bandwidth}k',
                            '-maxrate', f'{bandwidth}k',
                            '-bufsize', f'{bandwidth * 2}k',
                            '-profile:v', 'main',
                            '-movflags', 'faststart',
                            '-preset', 'fast',
                            '-an',
                            temp_file
                        ]
                        print_out(ffmpeg_command)
                        subprocess.run(ffmpeg_command, check=True)

                    # Combine the intermediates into a single DASH file
                    intermediate_files = [
                        f'{temp_file}#video:id={heights_to_use[index]}'
                        for index, temp_file in enumerate(temp_files)
                    ]
                    mp4box_command = [
                        self.mp4box_path,
                        '-dash', '4000',
                        '-rap',
                        '-segment-name', 'segment_$RepresentationID$_',
                        *intermediate_files,
                        '-out', temp_mpd_file,
                        '-mpd-title', f'{original_file_name}.mpd'
                    ]
                    print_out(mp4box_command)
                    subprocess.run(mp4box_command, check=True)

                    # Official Output - Copy the whole DASH folder to the optimized directory
                    shutil.move(temp_dash_container, optimized_dir_path)

                    # Official Output - Copy original file to original directory
                    # This should happen after the transcode as it is less likely to fail
                    shutil.copy(original_file, original_dir_path)

                    self.task_service.set_task_status(transcode_task_id, TaskStatus.COMPLETED) 

                except Exception as e:
                    # will need to catch specific exceptions in the future for more granular error messages
                    print_err(str(e))
                    self.task_service.set_task_status(transcode_task_id, TaskStatus.ERROR)
                    self.task_service.set_task_error_message(transcode_task_id, str(e))
