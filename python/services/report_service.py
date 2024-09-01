import os

from data.report import Report
from services.metadata_service import MediaType
from utils.constants import video_extensions, image_extensions, video_extensions_optimized, image_extensions_optimized, video_extensions_countable

from services.job_service import JobService

class ReportService:

    def __init__(self):
        self.job_service = JobService()

    def create_final_report(self, job_id, media_type, source_dir, original_dir, optimzied_dir):
        extensions = []
        optimized_extensions = []
        count_only = None
        if media_type == MediaType.VIDEO:
            extensions = video_extensions
            optimized_extensions = video_extensions_optimized
            count_only = video_extensions_countable
        else:
            extensions = image_extensions
            optimized_extensions = image_extensions_optimized

        report = Report(job_id)

        source_dir_count, source_dir_size = self.get_dir_report(source_dir, extensions)
        original_dir_count, original_dir_size = self.get_dir_report(original_dir, extensions)
        optimzied_dir_count, optimzied_dir_size = self.get_dir_report(optimzied_dir, optimized_extensions, count_only)

        report.source_folder_path = source_dir
        report.source_folder_size = source_dir_size
        report.source_folder_media_count = source_dir_count

        report.original_folder_path = original_dir
        report.original_folder_size = original_dir_size
        report.original_folder_media_count = original_dir_count

        report.optimized_folder_path = optimzied_dir
        report.optimized_folder_size = optimzied_dir_size
        report.optimized_folder_media_count = optimzied_dir_count

        self.job_service.update_report_data(job_id, report)

    def get_dir_report(self, dir, extensions, count_only_extensions=None):
        count = 0
        total_size = 0
        for root, dirs, filenames in os.walk(dir):
            for filename in filenames:
                file_extension = os.path.splitext(filename)[1]
                if file_extension:
                    file_extension = file_extension.lower()
                if file_extension in extensions:
                    total_size += os.path.getsize(os.path.join(root, filename))
                    if count_only_extensions:
                        if file_extension in count_only_extensions:
                            count += 1
                    else:
                        count += 1

        return count, total_size
