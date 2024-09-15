import os
import threading
import pandas as pd
from datetime import datetime


from services.job_service import JobService
from services.task_service import TaskService
from services.validator_service import ValidatorService
from model.ingest.job_model import JobType, JobStatus

from services.metadata_service import MediaType
from services.video_metadata_service import VideoMetadataService
from services.image_metadata_service import ImageMetadataService

from utils.constants import image_extensions, video_extensions
from utils.prints import print_err

class IngestService:

    IGNORE_LIST = [
        '._',
        '.apdisk',
        '.ds_store',
        '.fseventsd',
        '.spotlight',
        '.temporaryitems',
        '.trash',
        '.trashes',
        '.volumeicon.icns',
        'desktop.ini',
        'thumbs.db',
    ]
    IMAGE_PARSE_BATCH_SIZE = 100

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
        try:
            target_extensions = image_extensions if media_type == MediaType.IMAGE else video_extensions
            files = self.get_files(source_dir, target_extensions)

            metadata_arr = []
            if (media_type == MediaType.IMAGE):
                for i in range(0, len(files), self.IMAGE_PARSE_BATCH_SIZE):
                    metadata_for_batch = self.image_metadata_service.parse_metadata(
                        files[i:i+self.IMAGE_PARSE_BATCH_SIZE]
                    )
                    metadata_arr.extend(metadata_for_batch)
            else:
                for file_path in files:
                    media_metadata = self.video_metadata_service.parse_metadata(file_path)
                    metadata_arr.append(media_metadata)

            validated_metadata = []
            for metadata in metadata_arr:
                validation_status = self.validator_service.validate_media(source_dir, metadata, media_type)
                metadata.validation_status = validation_status
                validated_metadata.append(metadata.to_dict())

            self.job_service.store_job_data(job_id, validated_metadata)
        except Exception as err:
            print_err(f"Error parsing media: {err}")
            self.job_service.set_error(job_id, str(err))


    def get_files(self, source_dir, extensions):
        found_files = []
        for root, dirs, filenames in os.walk(source_dir):
            for filename in filenames:
                # Ignore special/hidden files
                if any([filename.lower().startswith(ignore) for ignore in self.IGNORE_LIST]):
                    continue
                file_extension = os.path.splitext(filename)[1]
                if file_extension:
                    file_extension = file_extension.lower()
                if file_extension in extensions:
                    found_files.append(os.path.join(root, filename))

        return found_files


    def count_media(self, source_dir):
        video_file_paths = self.get_files(source_dir, video_extensions)
        video_files_count = len(video_file_paths)
        image_file_paths = self.get_files(source_dir, image_extensions)
        image_files_count = len(image_file_paths)

        all_paths = []
        all_paths.extend(video_file_paths)
        all_paths.extend(image_file_paths)

        error = None
        for file_path in all_paths:
            if not os.path.exists(file_path):
                error = ValidatorService.WINDOWS_MAX_PATH_LENGTH_ERROR
                break

        invalid_path = self.validator_service.validate_year_for_source(source_dir)
        if invalid_path:
            error = f'A required year folder does not exist:\n{invalid_path}'

        return {
            'images': image_files_count,
            'videos': video_files_count,
            'error': error,
        }

    def generate_batch_rename_report(self, job_id, output_folder):
        job_data = self.job_service.get_job_data(job_id)
        tasks = self.task_service.get_tasks_by_job_id(job_id)
        report_data = self.job_service.get_report_data(job_id)

        source_dir = job_data['source_dir']

        task_tuple_arr = []

        task_tuple_arr.append((
            report_data.source_folder_path,
            report_data.original_folder_path,
            report_data.optimized_folder_path
        ))
        task_tuple_arr.append((
            IngestService.size_string(report_data.source_folder_size),
            IngestService.size_string(report_data.original_folder_size),
            IngestService.size_string(report_data.optimized_folder_size),
        ))
        task_tuple_arr.append((
            f'{report_data.source_folder_media_count} files',
            f'{report_data.original_folder_media_count} files',
            f'{report_data.optimized_folder_media_count} files',
        ))

        for task in tasks:
            transcode_settings = task.transcode_settings
            old_name = transcode_settings['file_path'].replace(source_dir, '').lstrip(os.path.sep)
            new_name = os.path.join(os.path.dirname(old_name), transcode_settings['new_name'])
            task_tuple_arr.append((old_name, old_name, new_name))

        csv_df = pd.DataFrame(
            task_tuple_arr,
            columns=["Source Folder", "Originals Destination", "Optimized Destination"]
        )

        datestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(output_folder, f'VITAL_Ingest_Report_{datestamp}.csv')
        csv_df.to_csv(output_file, index=False)
        return os.path.exists(output_file)

    @staticmethod
    def size_string(bytes):
        if bytes < 1024 ** 1:
            return f'{bytes} B'
        if bytes < 1024 ** 2:
            return f'{bytes / 1024 ** 1:.3f} KB'
        if bytes < 1024 ** 3:
            return f'{bytes / 1024 ** 2:.3f} MB'
        return f'{bytes / 1024 ** 3:.3f} GB'
