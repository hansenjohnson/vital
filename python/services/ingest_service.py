import os
import subprocess
import re


class IngestService:

    def __init__(self):
        self.video_extensions = ['.mp4', '.avi', '.mov', '.flv', '.wmv', '.ts', '.m4v']
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.orf', '.cr2', '.dng']

    def get_files(self, source_dir):
        video_files = []
        image_files = []

        for root, dirs, filenames in os.walk(source_dir):
            for filename in filenames:
                file_extension = os.path.splitext(filename)[1]
                if file_extension:
                    file_extension = file_extension.lower()
                if file_extension in self.video_extensions:
                    video_files.append(os.path.join(root, filename))
                elif file_extension in self.image_extensions:
                    image_files.append(os.path.join(root, filename))

        return {
            'images': image_files,
            'videos': video_files,
        }

    def count_media(self, source_dir):
        files = self.get_files(source_dir)
        return {
            'images': len(files['images']),
            'videos': len(files['videos']),
        }

    def get_file_metadata(self, source_dir):
        file_size = os.path.getsize(source_dir)
        file_extension = os.path.splitext(source_dir)[1]
        return {
            'size': file_size,
            'extension': file_extension,
        }

    # still in development
    def get_video_info(self, video_path):
        command = ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,duration', '-of',
                   'default=noprint_wrappers=1:nokey=1', video_path]
        output = subprocess.check_output(command).decode('utf-8')

        lines = output.strip().split('\n')
        width, height, frame_rate, duration = lines
        frame_rate = frame_rate.split('/')[0]

        command = ['du', '-b', video_path]
        output = subprocess.check_output(command).decode('utf-8')
        file_size = re.search('(\d+)', output).group(1)

        print(width, height, frame_rate, duration, file_size)

        return {
            'resolution': f'{width}x{height}',
            'frame_rate': frame_rate,
            'duration': duration,
            'file_size': file_size
        }
