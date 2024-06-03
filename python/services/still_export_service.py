import subprocess
import os
import sys
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
        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))

        self.ffmpeg_path = os.path.join(base_dir, 'resources', 'ffmpeg.exe')
        if not os.path.isfile(self.ffmpeg_path):
            print_err(f"ffmpeg.exe does not exist at {self.ffmpeg_path}")
            raise FileNotFoundError(f"ffmpeg.exe does not exist at {self.ffmpeg_path}")
        
    def create_still(self, payload):
        try:
            catalog_video_id = payload['CatalogVideoId']
            output_image_name = payload['FileName']
            frame_number = payload.get('FrameNumber', 100) # provide default value until FE sends FrameNumber
            timestamp = payload['Timestamp'] # should look like HH:MM:SS.000
            created_date = payload['CreatedDate']

            catalog_video = self.video_model.get_video_by_id(catalog_video_id)

            output_image_path = settings_service.get_setting(SettingsEnum.STILLEXPORT_DIR_PATH.value)
            original_video_folder_path = file_path.catalog_folder_path(
                catalog_video['CatalogFolderId'],
                SettingsEnum.BASE_FOLDER_OF_ORIGINAL_VIDEOS.value
            )
            original_video_name = catalog_video['OriginalFileName']

            original_video_file_path = str(os.path.join(original_video_folder_path, original_video_name))
            output_file_path = str(os.path.join(output_image_path, output_image_name))

            # this command expects .jpg in the output path, but will not enforce it
            command = [
                self.ffmpeg_path,
                '-loglevel', 'error',
                '-n',
                '-ss', timestamp,
                '-i', original_video_file_path,
                '-frames:v', '1',
                '-update', '1',
                '-qscale:v', '2',
                output_file_path
            ]

            print_out(' '.join(command))
            try:
                subprocess.run(command, check=True)
            except subprocess.CalledProcessError as e:
                raise e

            if os.path.isfile(output_file_path):
                self.still_export_model.create_still_export({
                    'CatalogVideoId': catalog_video_id,
                    'FileName': output_image_name,
                    'FileLocation': output_image_path,
                    'FrameNumber': frame_number,
                    'CreatedDate': created_date
                })
                print_out(f"Frame extracted successfully and saved to {output_image_path}")
            else:
                raise Exception(f"Failed to extract frame from video: {original_video_name}")
        except Exception as e:
            print_err(f"An error occurred: {e}")
            raise e
