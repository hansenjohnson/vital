import subprocess
import os
import sys
from model.video_model import VideoModel
from utils import file_path
from settings.settings_enum import SettingsEnum


class StillExportService:

    def __init__(self):
        self.video_model = VideoModel()
        current_dir = os.path.dirname(__file__)
        base_dir = os.path.abspath(os.path.join(current_dir, '..\\..'))
        self.ffmpeg_path = os.path.join(base_dir, 'ffmpeg', 'ffmpeg.exe')

    def extract_frame(self, catalog_video_id, output_image_path, output_image_name, frame_number):
        try:
            original_video_folder_path = file_path.catalog_folder_path(catalog_video_id, SettingsEnum.BASE_FOLDER_OF_ORIGINAL_VIDEOS.value)

            catalog_video = self.video_model.get_video_by_id(catalog_video_id)
            original_video_name = catalog_video['OriginalFileName']

            original_video_file_path = str(os.path.join(original_video_folder_path, original_video_name))
            sys.stderr.write('\n' + original_video_file_path + '\n')

            output_file_path = str(os.path.join(output_image_path, output_image_name))

            command = [
                self.ffmpeg_path,
                '-y',
                '-i', original_video_file_path,
                '-vf', f'select=eq(n\\,{frame_number})',
                '-vframes', '1',
                output_file_path
            ]
            subprocess.run(command, check=True)
            sys.stderr.write(f"Frame extracted successfully and saved to {output_image_path}")
        except Exception as e:
            sys.stderr.write(f"An error occurred: {e}")