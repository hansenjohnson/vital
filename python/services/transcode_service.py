import threading
import os
import sys
import tempfile
import subprocess
import shutil
import traceback

from typing import List
from data.transcode_settings import TranscodeSettings
from services.job_service import JobService
from services.task_service import TaskService
from model.ingest.job_model import JobType
from utils import prints
from settings.settings_service import SettingsService, SettingsEnum
from data.task import TaskStatus


class TranscodeService:

    def __init__(self):
        self.job_service = JobService()
        self.task_service = TaskService()
        self.settings_service = SettingsService()

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.ffmpeg_path = os.path.join(base_dir, 'resources', 'ffmpeg.exe')

    def start_transcode_job(self, transcode_settings_list: List[TranscodeSettings]) -> int:

        transcode_job_id = self.job_service.create_job(JobType.TRANSCODE)

        transcode_task_ids = []
        for transcode_settings_json in transcode_settings_list:
            transcode_settings = TranscodeSettings(**transcode_settings_json)
            transcode_task_id = self.task_service.create_task(transcode_job_id, transcode_settings)
            transcode_task_ids.append(transcode_task_id)

        threading.Thread(target=self.transcode_videos, args=(transcode_task_ids,)).start()
        
        return transcode_job_id

    def restart_transcode_job(self, job_id: int) -> int:
        failed_transcode_task_ids = self.task_service.get_all_task_ids_by_status(job_id, TaskStatus.PENDING)
        failed_transcode_task_ids.extend(self.task_service.get_all_task_ids_by_status(job_id, TaskStatus.ERROR))
        
        print(failed_transcode_task_ids)
        threading.Thread(target=self.transcode_videos, args=(failed_transcode_task_ids,)).start()

        return job_id

    def transcode_videos(self, transcode_task_ids: List[int]):   
        video_output_dir = self.settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)

        with tempfile.TemporaryDirectory() as temp_dir:
            for transcode_task_id in transcode_task_ids:
                try:
                    transcode_settings = self.task_service.get_transcode_settings(transcode_task_id)
                    original_file = transcode_settings.file_path
                    temp_file = os.path.join(temp_dir, f"temp_{os.path.basename(original_file)}")

                    # sample ffmpeg command, will be substituted
                    ffmpeg_command = [
                        self.ffmpeg_path,
                        '-i',original_file,
                    temp_file 
                    ]
                    
                    subprocess.run(ffmpeg_command, check=True) 


                    destination_location = os.path.join(video_output_dir, f"output_{os.path.basename(original_file)}")

                    shutil.move(temp_file, destination_location)

                    self.task_service.set_task_status(transcode_task_id, TaskStatus.COMPLETED) 

                except Exception as e:
                    print('error', transcode_task_id)
                    # will need to catch specific exceptions in the future for more granular error messages
                    self.task_service.set_task_status(transcode_task_id, TaskStatus.ERROR)
                    self.task_service.set_task_error_message(transcode_task_id, str(e))
            