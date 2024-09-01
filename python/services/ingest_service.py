import os
import threading
import pandas as pd


from services.job_service import JobService
from services.task_service import TaskService
from services.validator_service import ValidatorService
from model.ingest.job_model import JobType, JobStatus

from services.metadata_service import MediaType
from services.video_metadata_service import VideoMetadataService
from services.image_metadata_service import ImageMetadataService

from utils.constants import image_extensions, video_extensions
from utils.prints import print_out

class IngestService:

    def __init__(self):
        self.job_service = JobService()
        self.validator_service = ValidatorService()

        self.task_service = TaskService()

        self.image_metadata_service = ImageMetadataService()
        self.video_metadata_service = VideoMetadataService()


    def create_parse_media_job(self, source_dir, media_type):
        job_id = self.job_service.create_job(JobType.METADATA, JobStatus.INCOMPLETE)
        threading.Thread(target=self.parse_media, args=(job_id, source_dir, media_type)).start()
        return job_id


    def parse_media(self, job_id, source_dir, media_type):
        if (media_type == MediaType.IMAGE):
            files = self.get_files(source_dir, image_extensions)
            metadata_arr = self.image_metadata_service.parse_metadata(files)

            validated_metadata = []
            for metadata in metadata_arr:
                validation_status = self.validator_service.validate_media(source_dir, metadata, media_type)
                metadata.validation_status = validation_status
                validated_metadata.append(metadata.to_dict())

            self.job_service.store_job_data(job_id, validated_metadata)
        else:
            files = self.get_files(source_dir, video_extensions)

            metadata = []
            for file_path in files:
                # TODO: handle case of ffprobe_metadata failing with relation to reporting that error on UI
                media_metadata =  self.video_metadata_service.parse_metadata(file_path)
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
        video_files_count = len(self.get_files(source_dir, video_extensions))
        image_files_count = len(self.get_files(source_dir, image_extensions))

        return {
            'images': image_files_count,
            'videos': video_files_count,
        }

    def generate_batch_rename_report(self, job_id, output_folder):
        tasks = self.task_service.get_tasks_by_job_id(job_id)

        task_tuple_arr = []

        for task in tasks:
            transcode_settings = task.transcode_settings
            old_name = os.path.basename(transcode_settings['file_path'])
            new_name = transcode_settings['new_name']
            task_tuple_arr.append((old_name, new_name))

        csv_df = pd.DataFrame(task_tuple_arr, columns=["Original File Name", "Renamed File Name"])

        csv_df.to_csv(output_folder, index=False)


