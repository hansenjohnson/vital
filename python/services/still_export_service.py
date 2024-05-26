import subprocess
import os
import sys
from model.video_model import VideoModel


class StillExportService:

    def __init__(self):
        self.video_model = VideoModel()
        current_dir = os.path.dirname(__file__)
        base_dir = os.path.abspath(os.path.join(current_dir, '..\\..'))
        self.ffmpeg_path = os.path.join(base_dir, 'ffmpeg', 'ffmpeg.exe')
        sys.stderr.write('\n' + self.ffmpeg_path +  '\n')

    def extract_frame(self, catalog_video_id, output_image_path, output_image_name, time):
        # video = self.video_model.get_video_by_id(catalog_video_id)
        # video_path = video['OriginalFileName']
        output_file_path = str(os.path.join(output_image_path, output_image_name))

        command = [
            self.ffmpeg_path,
            '-i', 'C:\\Users\\Matt\\video-catalog-suite\\test-files\\Ken.Burns.The.Civil.War.1of9.The.Cause.avi',
            '-ss', time,
            '-vframes', '1',
            output_file_path
        ]

        try:
            subprocess.run(command, check=True)
            sys.stderr.write(f"Frame extracted successfully and saved to {output_image_path}")
        except Exception as e:
            sys.stderr.write(f"An error occurred: {e}")