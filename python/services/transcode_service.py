import threading
import os
import sys
import tempfile
import subprocess
import shutil

from data.transcode_settings import TranscodeSettings

from services.job_service import JobService
from services.task_service import TaskService

from model.ingest.job_model import JobType

from settings.settings_service import SettingsService, SettingsEnum


from typing import List

class TranscodeService:

    def __init__(self):
        self.job_service = JobService()
        self.task_service = TaskService()
        self.settings_service = SettingsService()

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.ffmpeg_path = os.path.join(base_dir, 'resources', 'ffmpeg.exe')

    def start_transcode_job(self, transcode_settings_list: List[TranscodeSettings]):

        transcode_job_id = self.job_service.create_job(JobType.TRANSCODE)

        transcode_task_ids = []
        for transcode_settings_json in transcode_settings_list:
            transcode_settings = TranscodeSettings(**transcode_settings_json)
            transcode_task_id = self.task_service.create_task(transcode_job_id, transcode_settings)
            transcode_task_ids.append(transcode_task_id)

        threading.Thread(target=self.transcode_videos, args=(transcode_task_ids,)).start()
        
        return transcode_task_ids


    def transcode_videos(self, transcode_task_ids: List[int]):   
        video_output_dir = self.settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)

        with tempfile.TemporaryDirectory() as temp_dir:
            for transcode_task_id in transcode_task_ids:
                transcode_settings = self.task_service.get_transcode_settings(transcode_task_id)
                original_file = transcode_settings.file_path
                temp_file = os.path.join(temp_dir, f"temp_{os.path.basename(original_file)}")

                ffmpeg_command = [
                    self.ffmpeg_path,
                    '-i',original_file,
                   temp_file 
                ]
                
                try:
                    subprocess.run(ffmpeg_command, check=True) 
                except subprocess.CalledProcessError as e:
                    raise e

                destination_location = os.path.join(video_output_dir, f"output_{os.path.basename(original_file)}")

                print(temp_file) 
                print(destination_location)
                shutil.move(temp_file, destination_location)