import io
import os
import errno
import sys
import re
import tempfile
import shutil
import subprocess
import time
from subprocess import PIPE
from typing import List

from data.transcode_settings import TranscodeSettings
from services.job_service import JobService
from services.task_service import TaskService
from services.metadata_service import MediaType
from model.ingest.job_model import JobType, JobStatus, JobErrors

from settings.settings_service import SettingsService, SettingsEnum
from data.task import TaskStatus

from model.association.folder_model import FolderModel
from model.association.video_model import VideoModel

from utils.file_path import extract_catalog_folder_info, construct_catalog_folder_path, make_one_dir_ok_exists
from utils.prints import print_out, print_err
from utils.numbers import find_closest
from utils.death import add_terminator, remove_last_terminator

RETRY_DELAY_SEC = 1

class TranscodeService:

    HEIGHT_STEPS = [2160, 1080, 540, 270]
    BANDWIDTH_STEPS = {
        30: {
            2160: [20_000,  6_000, 2_000, 400],
            1080: [        10_000, 2_000, 400],
            540:  [                3_000, 400],
        },
        60: {
            2160: [40_000, 12_000, 4_000, 800],
            1080: [        20_000, 4_000, 800],
            540:  [                6_000, 800],
        },
    }
    PROGRESS_RATIOS = [12, 4, 2, 1]

    def __init__(self):
        self.job_service = JobService()
        self.task_service = TaskService()
        self.settings_service = SettingsService()
        self.folder_model = FolderModel()
        self.video_model = VideoModel()

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.ffmpeg_path = os.path.join(base_dir, 'resources', 'ffmpeg.exe')
        self.mp4box_path = os.path.join(base_dir, 'resources', 'mp4box.exe')
        self.dcraw_emu_path = os.path.join(base_dir, 'resources', 'dcraw_emu.exe')
        self.cjpeg_static = os.path.join(base_dir, 'resources', 'cjpeg-static.exe')

        self.standard_image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff'] 
        self.raw_image_extensions = ['.orf', '.cr2', '.dng', '.nef']

    def queue_transcode_job(self, source_dir: str, media_type: str, transcode_settings_list: List[TranscodeSettings]) -> int:
        transcode_job_id = self.job_service.create_job(JobType.TRANSCODE, JobStatus.QUEUED, {"source_dir": source_dir, "media_type": media_type})
        for transcode_settings_json in transcode_settings_list:
            transcode_settings = TranscodeSettings(**transcode_settings_json)
            self.task_service.create_task(transcode_job_id, transcode_settings)

        return transcode_job_id


    def transcode_media(self, transcode_job_id, source_dir, media_type, transcode_task_ids: List[int]):
        self.job_service.set_error(transcode_job_id, JobErrors.NONE)

        optimized_base_dir = self.settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)
        original_base_dir = self.settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_ORIGINAL_VIDEOS.value)

        source_dir_name = os.path.basename(source_dir)

        catalog_folder_info = extract_catalog_folder_info(source_dir_name)
        optimized_dir_path = construct_catalog_folder_path(optimized_base_dir, *catalog_folder_info)
        original_dir_path = construct_catalog_folder_path(original_base_dir, *catalog_folder_info)

        catalog_folder_id = self.folder_model.create_folder(*catalog_folder_info)

        # We expect that all folders leading up to these leafs will exist, and if not, that an Error should be thrown
        retry_job = True # Start as True just to enter the loop, but then we will only set it back to True when we want to retry
        while retry_job == True:
            retry_job = False
            try:
                make_one_dir_ok_exists(optimized_dir_path)
                make_one_dir_ok_exists(original_dir_path)
            except FileNotFoundError as e:
                # See the task loop for more details on this retry logic
                retry_job = True
                print_err(str(e))
                self.job_service.set_error(transcode_job_id, JobErrors.FILE_NOT_FOUND)
                self.job_service.set_job_status(transcode_job_id)
                time.sleep(RETRY_DELAY_SEC)

        self.job_service.set_error(transcode_job_id, JobErrors.NONE)
        for transcode_task_id in transcode_task_ids:
            with tempfile.TemporaryDirectory() as temp_dir:
                retry_task = True # Start as True just to enter the loop, but then we will only set it back to True when we want to retry
                while retry_task == True:
                    retry_task = False
                    try:
                        self.task_service.set_task_status(transcode_task_id, TaskStatus.INCOMPLETE)
                        self.task_service.set_task_error_message(transcode_task_id, '')

                        if (media_type == MediaType.VIDEO):
                            self.transcode_video(source_dir, optimized_dir_path, original_dir_path, catalog_folder_id, transcode_task_id, temp_dir)
                        else:
                            self.transcode_image(optimized_dir_path, original_dir_path, transcode_task_id, temp_dir)

                    except FileNotFoundError as e:
                        # We catch and retry on this error because it might signal that the user lost internet connection or
                        # VPN access to one of the output folders. We set an error string on the Job-level for communication to the UI
                        retry_task = True
                        print_err(str(e))
                        self.job_service.set_error(transcode_job_id, JobErrors.FILE_NOT_FOUND)
                        time.sleep(RETRY_DELAY_SEC)

                    except Exception as e:
                        print_err(str(e))
                        self.task_service.set_task_progress(transcode_task_id, 0)
                        self.task_service.set_task_status(transcode_task_id, TaskStatus.ERROR)
                        self.task_service.set_task_error_message(transcode_task_id, str(e))

                    finally:
                        self.job_service.set_job_status(transcode_job_id)

    def transcode_video(self, source_dir, optimized_dir_path, original_dir_path, catalog_folder_id, transcode_task_id, temp_dir):
        transcode_settings = self.task_service.get_transcode_settings(transcode_task_id)

        # Determine the Adaptive Bitrate Ladder for this video
        input_height = transcode_settings.input_height
        output_framerate = transcode_settings.output_framerate
        max_height = find_closest(self.HEIGHT_STEPS, input_height)
        max_height_idx = self.HEIGHT_STEPS.index(max_height)
        heights_to_use = self.HEIGHT_STEPS[max_height_idx:]
        framerate_similar = find_closest([30, 60], output_framerate)
        bandwidths_to_use = self.BANDWIDTH_STEPS[framerate_similar][max_height]
        progress_ratios = self.PROGRESS_RATIOS[max_height_idx:]

        # Prepare filepath variables
        shared_extension = '.mp4'
        original_file = transcode_settings.file_path
        original_file_name = os.path.splitext(os.path.basename(original_file))[0]
        output_file_name = transcode_settings.new_name or original_file_name
        original_subdirs = original_file.replace(source_dir, '').lstrip(os.path.sep).split(os.path.sep)[:-1]
        expected_final_dir = os.path.join(optimized_dir_path, *original_subdirs, output_file_name)
        expected_original_dir = os.path.join(original_dir_path, *original_subdirs)

        if os.path.isdir(expected_final_dir):
            # if final dir exists we must delete it, in order to perform a move of a whole new folder to that same location
            # this is because the Dash output will be a folder of files, whereas the original file is a single file
            shutil.rmtree(expected_final_dir, ignore_errors=True)
        for jindex, _ in enumerate(original_subdirs):
            # make each leaf dir up to the final leaf. This prevents accidentally making the base dirs if they don't exist
            # already for access or non-existence reasons
            subdirs_to_this_point = original_subdirs[:jindex + 1]
            make_one_dir_ok_exists(os.path.join(optimized_dir_path, *subdirs_to_this_point))
            make_one_dir_ok_exists(os.path.join(original_dir_path, *subdirs_to_this_point))

        temp_files = [
            os.path.join(temp_dir, f'{output_file_name}_{height}{shared_extension}')
            for height in heights_to_use
        ]
        temp_dash_container = os.path.join(temp_dir, output_file_name)
        output_file_name_mpd = f'{output_file_name}.mpd'
        temp_mpd_file = os.path.join(temp_dash_container, output_file_name_mpd)
        os.makedirs(temp_dash_container, exist_ok=True)

        # Transcode the video into multiple intermediates
        num_frames = transcode_settings.num_frames
        keyframe_rate = output_framerate * 2
        progress_bounds = TranscodeService.calculate_progress_bounds(progress_ratios)
        for index, output_height in enumerate(heights_to_use):
            bandwidth = bandwidths_to_use[index]
            temp_file = temp_files[index]
            ffmpeg_command = self.generate_transcode_command(
                original_file,
                keyframe_rate,
                output_framerate,
                output_height,
                bandwidth,
                temp_file,
            )

            progress_bounds_for_sub_task = progress_bounds[index]
            line_handler = self.create_ffmpeg_line_handler(
                transcode_task_id,
                num_frames,
                progress_bounds_for_sub_task
            )
            TranscodeService.run_command_with_terminator(ffmpeg_command, line_handler)

        # Combine the intermediates into a single DASH file
        intermediate_files = [
            f'{temp_file}#video:id={heights_to_use[index]}'
            for index, temp_file in enumerate(temp_files)
        ]
        mp4box_command = self.generate_dash_command(intermediate_files, temp_mpd_file, output_file_name_mpd)
        TranscodeService.run_command_with_terminator(mp4box_command)

        # Official Output - Copy the whole DASH folder to the optimized directory
        folder_to_move_into = os.path.dirname(expected_final_dir)
        if os.path.isdir(folder_to_move_into) == False:
            # shutil.move() does not throw an error if the destination folder does not exist, so we must do it manually
            raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), folder_to_move_into)
        shutil.move(temp_dash_container, folder_to_move_into)

        # Official Output - Copy original file to original directory
        # This should happen after the transcode as it is less likely to fail
        shutil.copy(original_file, expected_original_dir)

        expected_final_full_path = os.path.join(expected_final_dir, output_file_name_mpd)
        dash_file_partial_leaf = expected_final_full_path.replace(f'{optimized_dir_path}{os.path.sep}', '')

        self.video_model.create_video(catalog_folder_id, os.path.basename(original_file), dash_file_partial_leaf, output_framerate)

        self.task_service.set_task_progress(transcode_task_id, 100)
        self.task_service.set_task_status(transcode_task_id, TaskStatus.COMPLETED)

    def generate_transcode_command(self, original_file, keyframe_rate, output_framerate, output_height, bandwidth, temp_file):
        return [
            self.ffmpeg_path,
            '-v', 'warning',
            '-stats',
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

    def generate_dash_command(self, intermediate_files, temp_mpd_file, output_file_name_mpd):
        return [
            self.mp4box_path,
            '-dash', '4000',
            '-rap',
            '-segment-name', 'segment_$RepresentationID$_',
            *intermediate_files,
            '-out', temp_mpd_file,
            '-mpd-title', f'"{output_file_name_mpd}"'
        ]

    def create_ffmpeg_line_handler(self, transcode_task_id, total_frames, progress_bounds=(0, 100)):
        def line_callback(line):
            frames_complete = TranscodeService.parse_ffmpeg_progress(line)
            if frames_complete:
                percent_complete = frames_complete / total_frames
                new_absolute_progress = int(
                    (progress_bounds[1] - progress_bounds[0])
                    * percent_complete
                    + progress_bounds[0]
                )
                self.task_service.set_task_progress(transcode_task_id, new_absolute_progress)
        return line_callback
    

    def transcode_image(self, optimized_dir_path, original_dir_path, transcode_task_id, temp_dir):
        transcode_settings = self.task_service.get_transcode_settings(transcode_task_id)

        file_path = transcode_settings.file_path
        local_export_path = transcode_settings.local_export_path

        jpeg_quality = transcode_settings.jpeg_quality

        file_name, file_extension = os.path.splitext(file_path)
        file_name = os.path.basename(file_name)

        temp_decode_file = f'{temp_dir}\\temp_{file_name}'
        optimized_output_file = f'{optimized_dir_path}\\{file_name}.jpg'

        if file_extension in self.standard_image_extensions:
            temp_path = f'{temp_decode_file}.png'
            decode_command = self.generate_decode_command_standard(file_path, temp_path)
        else:
            temp_path = f'{temp_decode_file}.ppm'
            decode_command = self.generate_decode_command_raw(file_path, temp_decode_file)

        TranscodeService.run_command_with_terminator(decode_command)

        encode_command = self.generate_encode_command(temp_path, optimized_output_file, jpeg_quality)

        TranscodeService.run_command_with_terminator(encode_command)

        shutil.copy(file_path, original_dir_path)

        shutil.copy(optimized_output_file, optimized_dir_path)

        shutil.copy(optimized_output_file, local_export_path)

        self.task_service.set_task_progress(transcode_task_id, 100)
        self.task_service.set_task_status(transcode_task_id, TaskStatus.COMPLETED)
    
    def generate_decode_command_standard(self, input_path, temp_path):
        # inputs are ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff']
        # temp_path should end in .png
        return [
            self.ffmpeg_path,
            '-y',
            '-i', input_path,
            '-frames:v', '1',
            '-update', '1',
            temp_path,
        ]

    def generate_decode_command_raw(self, input_path, temp_path):
        # inputs are ['.orf', '.cr2', '.dng', '.nef']
        # temp_path should end in .ppm
        return [
            self.dcraw_emu_path,
            '-w',
            '-o', '1',
            '-q', '0',
            '-H', '0',
            '-Z', temp_path,
            input_path,
        ]

    def generate_encode_command(self, input_path, output_path, jpeg_quality):
        # output_path should end in .jpg
        # jpeg_quality should be between 0-100
        return [
            self.cjpeg_static,
            '-q', f'{jpeg_quality}',
            '-outfile', output_path,
            input_path,
        ]

    @staticmethod
    def run_command_with_terminator(command, line_callback = print_out):
        print_out(' '.join(command))
        with subprocess.Popen(command, stdout=PIPE, stderr=PIPE) as proc:
            add_terminator(proc.terminate)
            for line in io.TextIOWrapper(proc.stderr, encoding="utf-8"):
                line_callback(line)
        remove_last_terminator()
        if (proc.returncode != 0):
            raise subprocess.CalledProcessError(proc.returncode, command, proc.stdout, proc.stderr)

    @staticmethod
    def parse_ffmpeg_progress(line):
        match = re.match(r"frame=\s*(\d+)\s+fps=\s*\d+", line)
        if match:
            return int(match.group(1))
        return None

    @staticmethod
    def calculate_progress_bounds(ratios):
        # We use 96 because that evenly devides between 1, 2, 3, & 4 and it is "closeish" to 100
        # Since we want some progress lefover for the mp4 box command
        length_of_transcodes = 96
        ratio_sum = sum(ratios)
        bounds = []
        for index, ratio in enumerate(ratios):
            lower_bound = 0 if index == 0 else bounds[-1][1] + 1
            relative_upper_bound = int((ratio / ratio_sum) * length_of_transcodes)
            upper_bound = length_of_transcodes if index == len(ratios) - 1 else lower_bound + relative_upper_bound
            bounds.append((lower_bound, upper_bound))
        return bounds
