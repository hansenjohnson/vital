import os
import threading

from enum import Enum

from services.job_service import JobService
from services.validator_service import ValidatorService
from model.ingest.job_model import JobType, JobStatus

from services.metadata_service import MediaType
from services.video_metadata_service import VideoMetadataService
from services.image_metadata_service import ImageMetadataService

from utils.prints import print_err, print_out


class IngestService:

    def __init__(self):
        self.video_extensions = ['.mp4', '.avi', '.mov', '.flv', '.wmv', '.ts', '.m4v']
        self.image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.orf', '.cr2', '.dng', '.nef']

        self.job_service = JobService()
        self.validator_service = ValidatorService()


    def create_parse_media_job(self, source_dir, media_type):
        job_id = self.job_service.create_job(JobType.METADATA, JobStatus.INCOMPLETE)
        threading.Thread(target=self.parse_media, args=(job_id, source_dir, media_type)).start()
        return job_id


    def parse_media(self, job_id, source_dir, media_type):
        if (media_type == MediaType.video):
            files = self.get_files(source_dir, self.video_extensions)
            media_service = VideoMetadataService()
        else:
            files = self.get_files(source_dir, self.image_extensions)
            media_service = ImageMetadataService()

        metadata = []
        for file_path in files:
            # TODO: handle case of ffprobe_metadata failing with relation to reporting that error on UI
            media_metadata = media_service.parse_metadata(file_path)
            media_metadata.validation_status = self.validator_service.validate_media(source_dir, media_metadata, media_type)

            metadata.append(media_metadata.to_dict())

        self.job_service.store_job_data(job_id, metadata)


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
    

    def count_media(self, source_dir):
        video_files_count = len(self.get_files(source_dir, self.video_extensions))
        image_files_count = len(self.get_files(source_dir, self.image_extensions))

        return {
            'images': image_files_count,
            'videos': video_files_count,
        }
