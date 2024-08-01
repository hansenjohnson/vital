import os
import subprocess
import math
import threading

import time

from services.job_service import JobService

class IngestService:

    def __init__(self):
        self.video_extensions = ['.mp4', '.avi', '.mov', '.flv', '.wmv', '.ts', '.m4v']
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.orf', '.cr2', '.dng']

        self.job_service = JobService()

    def create_parse_video_job(self, source_dir):
        job_id = self.job_service.create_job()
        threading.Thread(target=self.parse_videos, args=(job_id, source_dir,)).start()
        return job_id

    def parse_videos(self, job_id, source_dir):
        video_files = self.get_files(source_dir, self.video_extensions)

        video_metadata = []
        for video in video_files:
            video_metadata.append(self.get_video_info(video))

        # remove this line
        time.sleep(5)

        self.job_service.store_job_data(job_id, video_metadata)

    def get_files(self, source_dir, extensions):
        image_files = []
        for root, dirs, filenames in os.walk(source_dir):
            for filename in filenames:
                file_extension = os.path.splitext(filename)[1]
                if file_extension:
                    file_extension = file_extension.lower()
                if file_extension in extensions:
                    image_files.append(os.path.join(root, filename))

        return image_files

    def get_video_info(self, video_path):
        command = ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,duration', '-of',
                   'default=noprint_wrappers=1:nokey=1', video_path]
        output = subprocess.check_output(command).decode('utf-8')

        lines = output.strip().split('\n')
        width, height, frame_rate, duration = lines

        width = width.replace('\r', '')
        height = height.replace('\r', '')

        frame_rate_parts = frame_rate.split('/')
        frame_rate = round(float(frame_rate_parts[0]) / float(frame_rate_parts[1]), 2)

        duration = duration.split('.')[0]

        file_size_mb = math.floor(os.path.getsize(video_path) / (1024 * 1024))

        return {
            'file_name': os.path.basename(video_path),
            'resolution': f'{width}x{height}',
            'frame_rate': frame_rate,
            'duration': duration,
            'file_size': file_size_mb
        }

    def count_media(self, source_dir):
        video_files_count = len(self.get_files(source_dir, self.video_extensions))
        image_files_count = len(self.get_files(source_dir, self.image_extensions))

        return {
            'images': image_files_count,
            'videos': video_files_count,
        }

