import os
import sys
import threading
from typing import List

from data.transcode_settings import TranscodeSettings
from services.job_service import JobService
from services.task_service import TaskService
from services.metadata_service import MediaType
from services.transcode_service import TranscodeService
from model.ingest.job_model import JobType, JobStatus

from settings.settings_service import SettingsService, SettingsEnum
from data.task import TaskStatus

from utils.prints import print_err
from utils.transcode_snippets import auto_exposure_correct


class ColorCorrectService:

    # Median grayscale value of an image to determine if it is dark
    DARK_IMAGE_THRESHOLD = 0.10

    TEMP_DIRNAME = 'temp-dark'

    def __init__(self):
        self.job_service = JobService()
        self.task_service = TaskService()
        self.settings_service = SettingsService()
        self.transcode_service = TranscodeService()

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.magick_path = os.path.join(base_dir, 'resources', 'magick.exe')

    def get_color_corrected_image_dir(self):
        thumbnail_dir = self.settings_service.get_setting(SettingsEnum.THUMBNAIL_DIR_PATH.value)
        temp_color_corrected_dir = os.path.join(thumbnail_dir, self.TEMP_DIRNAME)
        return temp_color_corrected_dir

    def identify_dark_images_from_collection(self, image_paths: List[str]):
        job_id = self.job_service.create_job(JobType.COLOR_CORRECT, JobStatus.INCOMPLETE, {
            "source_dir": '',
            "media_type": MediaType.IMAGE.value,
            "local_export_path": ''
        })
        for file_path in image_paths:
            self.task_service.create_task(job_id, TranscodeSettings(file_path=file_path))

        threading.Thread(target=self.run_dark_identify_tasks, args=(job_id,)).start()
        return job_id

    def run_dark_identify_tasks(self, job_id):
        tasks = self.task_service.get_tasks_by_job_id(job_id)
        for task in tasks:
            try:
                self.dark_identify_image(task.id)
                self.task_service.set_task_progress(task.id, 100)
                self.task_service.set_task_status(task.id, TaskStatus.COMPLETED)
            except Exception as err:
                # Even a single task error renders the whole job corrupt, so we catch
                # this one error, push it to the job level, can cancel the job
                print_err(f"Error identifying dark images")
                self.job_service.set_error(job_id, f'{err.__class__.__name__}: {err}')
                raise err
        self.job_service.set_job_status(job_id)

    def dark_identify_image(self, task_id):
        transcode_settings = self.task_service.get_transcode_settings(task_id)
        file_path = transcode_settings.file_path

        command = self.generate_dark_identify_command(file_path)
        output = TranscodeService.run_command_with_terminator(command)
        # parse the output from imagemagick
        clean_output = output.strip().strip('"')
        image_median = float(clean_output)
        if image_median <= self.DARK_IMAGE_THRESHOLD:
            transcode_settings.is_dark = True
            self.task_service.set_task_settings(task_id, transcode_settings)

    def generate_dark_identify_command(self, input_path):
        return [
            self.magick_path,
            input_path,
            '-colorspace', 'gray',
            '-format', '"%[fx:median]"',
            'info:',
        ]

    def create_dark_sample_images(self, file_paths: List[str]):
        job_id = self.job_service.create_job(JobType.COLOR_CORRECT, JobStatus.INCOMPLETE, {
                "source_dir": '',
                "media_type": MediaType.IMAGE.value,
                "local_export_path": ''
            })
        for file_path in file_paths:
            self.create_color_corrected_task(job_id, file_path)

        threading.Thread(target=self.run_color_corrected_tasks, args=(job_id,)).start()
        return job_id

    def create_color_corrected_task(self, job_id, file_path):
        file_name, file_extension = os.path.splitext(file_path)
        file_path_jpeg = f'{os.path.basename(file_name)}_color_corrected.jpg'
        transcode_settings = TranscodeSettings(file_path=file_path, new_name=file_path_jpeg)
        self.task_service.create_task(job_id, transcode_settings)

    def run_color_corrected_tasks(self, job_id):
        tasks = self.task_service.get_tasks_by_job_id(job_id)
        temp_sample_dir = self.get_color_corrected_image_dir()
        self.transcode_service.delete_sample_images(None, temp_sample_dir)
        os.makedirs(temp_sample_dir, exist_ok=True)

        for task in tasks:
            try:
                self.run_one_color_correction(task.id, temp_sample_dir)
                self.task_service.set_task_progress(task.id, 100)
                self.task_service.set_task_status(task.id, TaskStatus.COMPLETED)
            except Exception as err:
                # Even a single task error renders the whole job corrupt, so we catch
                # this one error, push it to the job level, can cancel the job
                print_err(f"Error creating dark image sample")
                self.job_service.set_error(job_id, f'{err.__class__.__name__}: {err}')
                raise err
        self.job_service.set_job_status(job_id)

    def run_one_color_correction(self, task_id, temp_dir):
        transcode_settings = self.task_service.get_transcode_settings(task_id)
        input_path = transcode_settings.file_path
        output_path = os.path.join(temp_dir, transcode_settings.new_name)
        command = self.generate_exposure_correct_command(input_path, output_path)
        TranscodeService.run_command_with_terminator(command)

    def generate_exposure_correct_command(self, input_path, output_path):
        return [
            self.magick_path,
            input_path,
            '-resize', '300',
            *auto_exposure_correct,
            '-quality', '50',
            output_path,
        ]
