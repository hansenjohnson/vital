import json

from services.scheduler_service import SchedulerService
from services.transcode_service import TranscodeService
from services.job_service import JobService
from services.task_service import TaskService

from data.task import TaskStatus

from model.ingest.job_model import JobStatus, JobType

from utils.prints import print_out

scheduler = SchedulerService()
transcode_service = TranscodeService()
job_service = JobService()
task_service = TaskService()

def schedule_job_run(run_date):
    job_id = scheduler.add_job(execute_jobs, run_date)
    return job_id
    
def execute_jobs():
    jobs = job_service.get_jobs(JobType.TRANSCODE, False)

    for job in jobs:
        job_service.set_job_status(job["id"], )

        job_data = json.loads(job["data"])
        source_dir = job_data["source_dir"]

        tasks = task_service.get_tasks_by_job_id(job["id"])

        non_complete_task_ids = []
        for task in tasks:
            if task.status != TaskStatus.COMPLETED.value:
                non_complete_task_ids.append(task.id)


        transcode_service.transcode_videos(job["id"], source_dir, non_complete_task_ids)

def remove_scheduled_jobs():
    scheduler.remove_jobs()
