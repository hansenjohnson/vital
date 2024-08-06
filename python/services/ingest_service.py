import os
import subprocess
import json
import threading
import sys

from data.video_medatadata import VideoMetadata

from services.job_service import JobService
from services.validator_service import ValidatorService

from utils.prints import print_err, print_out


class IngestService:

    def __init__(self):
        self.video_extensions = ['.mp4', '.avi', '.mov', '.flv', '.wmv', '.ts', '.m4v']
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.orf', '.cr2', '.dng', '.nef']

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.ffprobe_path = os.path.join(base_dir, 'resources', 'ffprobe.exe')
        if not os.path.isfile(self.ffprobe_path):
            print_err(f"ffprobe_path.exe does not exist at {self.ffprobe_path}")
            raise FileNotFoundError(f"ffprobe_path.exe does not exist at {self.ffprobe_path}")

        self.job_service = JobService()
        self.validator_service = ValidatorService()

    def create_parse_video_job(self, source_dir):
        job_id = self.job_service.create_job()
        threading.Thread(target=self.parse_videos, args=(job_id, source_dir,)).start()
        return job_id


    def parse_videos(self, job_id, source_dir):
        video_files = self.get_files(source_dir, self.video_extensions)

        video_metadata_arr = []
        for video_path in video_files:
            video_metadata = self.ffprobe_metadata(video_path)
            video_metadata.validation_status = self.validator_service.validate_video(source_dir, video_metadata)

            video_metadata_arr.append(video_metadata.to_dict())

        self.job_service.store_job_data(job_id, video_metadata_arr)


    def get_files(self, source_dir, extensions):
        found_files = []
        for root, dirs, filenames in os.walk(source_dir):
            for filename in filenames:
                file_extension = os.path.splitext(filename)[1]
                if file_extension:
                    file_extension = file_extension.lower()
                if file_extension in extensions:
                    found_files.append(os.path.join(root, filename))

        return found_files

    def ffprobe_metadata(self, video_path, start_number=None):
        command = [
            self.ffprobe_path,
            "-loglevel",
            "panic",
            "-hide_banner",
            "-show_streams",
            "-select_streams",
            "v",
            "-print_format",
            "json",
            video_path,
        ]
        if start_number:
            command.extend(["-start_number", str(start_number)])
        print_out(f'Running ffprobe command: {" ".join(command)}')
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        metadata_json, error = process.communicate()
        if error:
            print_err.error("ffprobe error: %s", error)

        metadata_obj = json.loads(metadata_json)
        try:
            metadata = metadata_obj["streams"][0]
        except KeyError:
            print_err("No FFprobe metadata was found at path %s", video_path)
            return None
        return VideoMetadata(
            file_name=os.path.basename(video_path),
            file_path=video_path,
            width=metadata['width'],
            height=metadata['height'],
            duration=metadata['duration'],
            frame_rate=self.parse_frame_rate_str(metadata.get("r_frame_rate")),
            size=os.path.getsize(video_path),
            created_date=os.path.getctime(video_path),
            modified_date=os.path.getmtime(video_path),
            validation_status=None
        )

    def parse_frame_rate_str(self, frame_rate_str):
        if frame_rate_str:
            rates = frame_rate_str.split("/")
            if len(rates) > 1:
                rate = float(rates[0]) / float(rates[1])
            else:
                rate = float(rates[0])
            return str(rate)
        return ""

    def count_media(self, source_dir):
        video_files_count = len(self.get_files(source_dir, self.video_extensions))
        image_files_count = len(self.get_files(source_dir, self.image_extensions))

        return {
            'images': image_files_count,
            'videos': video_files_count,
        }
