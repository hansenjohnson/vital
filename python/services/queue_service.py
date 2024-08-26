import json
import threading
import uuid

from services.scheduler_service import SchedulerService
from services.transcode_service import TranscodeService
from services.job_service import JobService
from services.task_service import TaskService
from services.metadata_service import MediaType

from utils.prints import print_err, print_out

from data.task import TaskStatus

from model.ingest.job_model import JobType

scheduler = SchedulerService()
transcode_service = TranscodeService()
job_service = JobService()
task_service = TaskService()

def schedule_job_run(run_date):
    job_id = scheduler.add_job(execute_jobs, run_date)
    return job_id

def execute_jobs():
    # Create a unique id for this specific run of execute_jobs, so that we only run
    # available jobs once. Future runs will have a different id, allowing them to run
    # any imcomplete job that was not completed in this run.
    execution_run_id = str(uuid.uuid4())

    try:
        scheduler.set_run_status(True)
        while True:
            jobs = job_service.get_jobs(JobType.TRANSCODE, False, current_execution_id=execution_run_id)
            print_out(f"Found {len(jobs)} incomplete jobs to execute")

            if not jobs:
                break

            for job in jobs:
                job_service.set_job_status(job["id"], )

                job_data = json.loads(job["data"])
                source_dir = job_data["source_dir"]

                tasks = task_service.get_tasks_by_job_id(job["id"])

                non_complete_task_ids = []
                for task in tasks:
                    if task.status != TaskStatus.COMPLETED.value:
                        non_complete_task_ids.append(task.id)
          

                media_type = MediaType[json.loads(job['data'])['media_type'].upper()]

                transcode_service.transcode_media(job["id"], source_dir, media_type, non_complete_task_ids)
    except Exception as e:
        print_err(f"Failed excecuting jobs: {e}")
        raise e
    finally:
        scheduler.set_run_status(False)


def execute_job_now():
    threading.Thread(target=execute_jobs).start()

def remove_scheduled_jobs():
    scheduler.remove_jobs()
