import os
import sys
import tempfile
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

from utils.prints import print_out, print_err


class ColorCorrectService:

    DARK_IMAGE_THRESHOLD = 0.3
    TEMP_DIRNAME = 'temp-dark'

    def __init__(self):
        self.job_service = JobService()
        self.task_service = TaskService()
        self.settings_service = SettingsService()

        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.magick_path = os.path.join(base_dir, 'resources', 'magick.exe')

    def get_color_corrected_image_dir(self):
        thumbnail_dir = self.settings_service.get_setting(SettingsEnum.THUMBNAIL_DIR_PATH.value)
        temp_color_corrected_dir = os.path.join(thumbnail_dir, self.TEMP_DIRNAME)
        return temp_color_corrected_dir

    # Not Used Yet
    # def create_color_corrected_images(self, image_paths: List[str]):
    #     job_id = self.job_service.create_job(JobType.COLOR_CORRECT, JobStatus.INCOMPLETE, {
    #             "source_dir": '',
    #             "media_type": MediaType.IMAGE.value,
    #             "local_export_path": ''
    #         })

    #     self.create_color_corrected_tasks(job_id, image_paths)

    #     threading.Thread(target=self.run_color_corrected_tasks, args=(job_id,)).start()
    #     return job_id

    # Not Used Yet
    # def create_color_corrected_tasks(self, job_id, file_paths):
    #     for file_path in file_paths:
    #         file_name, file_extension = os.path.splitext(file_path)
    #         file_path_jpeg = f'{os.path.basename(file_name)}_color_corrected.jpg'
    #         transcode_settings = TranscodeSettings(file_path=file_path, new_name=file_path_jpeg)
    #         self.task_service.create_task(job_id, transcode_settings)

    # Not Used Yet
    # def run_color_corrected_tasks(self, transcode_job_id):
    #     tasks = self.task_service.get_tasks_by_job_id(transcode_job_id)

    #     try:
    #         with tempfile.TemporaryDirectory() as temp_dir:
    #             for task in tasks:
    #                 transcode_task_id = task.id
    #                 try:
    #                     _, output_file_path = self.run_transcode_commands(transcode_task_id, temp_dir, transcode_settings)
    #                     self.task_service.set_task_progress(transcode_task_id, 100)
    #                     self.task_service.set_task_status(transcode_task_id, TaskStatus.COMPLETED)

    #                 except Exception as e:
    #                     print_err(str(e))
    #                     self.task_service.set_task_progress(transcode_task_id, 0)
    #                     self.task_service.set_task_status(transcode_task_id, TaskStatus.ERROR)
    #                     self.task_service.set_task_error_message(transcode_task_id, str(e))

    #     finally:
    #         self.job_service.set_job_status(transcode_job_id)

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
                print_err(f"Error identifying dark images: task {task.id} -- {err}")
                self.job_service.set_error(job_id, str(err))
                break
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

    def generate_exposure_correct_command(self, input_path, output_path):
        return [
            self.magick_path,
            input_path,
            '-resize', '300',
            '-auto-gamma',
            '-contrast-stretch', '0.05%x0.01%',
            '-quality', '50',
            output_path,
        ]

    def delete_color_corrected_images(self, job_id):
        thumbnail_dir = self.settings_service.get_setting(SettingsEnum.THUMBNAIL_DIR_PATH.value)
        temp_color_corrected_dir = os.path.join(thumbnail_dir, self.TEMP_DIRNAME)
        file_in_temp_dir = os.listdir(temp_color_corrected_dir)

        tasks = self.task_service.get_tasks_by_job_id(job_id)
        for task in tasks:
            transcode_settings = self.task_service.get_transcode_settings(task.id)
            file_name = os.path.basename(transcode_settings.new_name)
            if file_name in file_in_temp_dir:
                os.remove(os.path.join(temp_color_corrected_dir, file_name))

        os.removedirs(temp_color_corrected_dir)
        return job_id
