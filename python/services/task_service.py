from model.ingest.task_model import TaskModel
from data.transcode_settings import TranscodeSettings

class TaskService:
    def __init__(self):
        self.task_model = TaskModel()


    def create_task(self, job_id: int, transcode_settings: TranscodeSettings) -> int:
        return self.task_model.create(job_id, transcode_settings)

    
    def get_transcode_settings(self, task_id: int) -> TranscodeSettings:
        return self.task_model.get_transcode_settings(task_id)


    def get_all_task_by_job_id(self, job_id: int):
        self.get_all_task_by_job_id(job_id)


    def get_task_status(self, task_id: int):
        return self.task_model.get_task_status(task_id)
