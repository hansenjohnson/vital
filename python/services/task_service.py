from model.ingest.task_model import TaskModel
from data.transcode_settings import TranscodeSettings
from data.task import TaskStatus

class TaskService:
    def __init__(self):
        self.task_model = TaskModel()


    def create_task(self, job_id: int, transcode_settings: TranscodeSettings) -> int:
        return self.task_model.create(job_id, transcode_settings)
    
    
    def get_tasks_by_job_id(self, job_id: int):
        return self.task_model.get_tasks_by_job_id(job_id)
    
    def get_transcode_settings(self, task_id: int) -> TranscodeSettings:
        return self.task_model.get_transcode_settings(task_id)

    def get_all_task_ids_by_status(self, job_id: int, status: str):    
        return self.task_model.get_all_task_ids_by_status(job_id, status)
    
    def set_task_status(self, task_id: int, status: TaskStatus):
        self.task_model.update_task_status(task_id, status)

    def set_task_error_message(self, task_id: int, error_message: str):
        self.task_model.set_task_error_message(task_id, error_message)
