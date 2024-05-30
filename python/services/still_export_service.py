import subprocess
import os
import sys
import time
from model.video_model import VideoModel
from model.still_export_model import StillExportModel
from utils import file_path
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum
from utils.prints import print_err, print_out

settings_service = SettingsService()


class StillExportService:

    def __init__(self):
        self.video_model = VideoModel()
        self.still_export_model = StillExportModel()
        current_dir = os.path.dirname(__file__)
        base_dir = os.path.abspath(os.path.join(current_dir, '..\\..'))
        self.ffmpeg_path = os.path.join(base_dir, 'bin', 'ffmpeg.exe')

    def create_still(self, payload):
        try:
            catalog_video_id = payload['CatalogVideoId']
            output_image_name = payload['FileName']
            frame_number = payload['FrameNumber']
            created_by = payload['CreatedBy']
            created_date = payload['CreatedDate']

            output_image_path = settings_service.get_setting(SettingsEnum.STILLEXPORT_DIR_NAME.value)
            original_video_folder_path = file_path.catalog_folder_path(catalog_video_id, SettingsEnum.BASE_FOLDER_OF_ORIGINAL_VIDEOS.value)

            catalog_video = self.video_model.get_video_by_id(catalog_video_id)
            original_video_name = catalog_video['OriginalFileName']

            original_video_file_path = str(os.path.join(original_video_folder_path, original_video_name))
            output_file_path = str(os.path.join(output_image_path, output_image_name))

            command = [
                self.ffmpeg_path,
                '-y',
                '-i', original_video_file_path,
                '-vf', f'select=eq(n\\,{frame_number})',
                '-vframes:v', '1',
                '-update', '1',
                output_file_path
            ]
            subprocess.run(command, check=True)
            if os.path.isfile(output_file_path):
                self.still_export_model.create_still_export({
                    'CatalogVideoId': catalog_video_id,
                    'FileName': output_image_name,
                    'FileLocation': output_image_path,
                    'CreatedBy': created_by,
                    'CreatedDate': created_date
                })
                print_out(f"Frame extracted successfully and saved to {output_image_path}")
            else:
                raise Exception(f"Failed to extract frame from video: {original_video_name}")
        except Exception as e:
            print_err(f"An error occurred: {e}")
            raise e
