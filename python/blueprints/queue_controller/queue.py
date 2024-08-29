from flask import Blueprint, request

from services.queue_service import schedule_job_run, remove_scheduled_jobs, execute_job_now
from services.scheduler_service import SchedulerService
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('queue', __name__)
scheduler_service = SchedulerService()


@bp.route('/schedule', methods=['POST'])
@tryable_json_endpoint
def schedule():
    payload = request.json
    run_date = payload['run_date']
    return schedule_job_run(run_date)


@bp.route('/schedule', methods=["GET"])
@tryable_json_endpoint
def get_scheduled_queue():
    scheduled_job = scheduler_service.get_job()
    scheduled_job_time = None if scheduled_job is None else str(scheduled_job.next_run_time)
    return {"scheduled_job": scheduled_job_time}


@bp.route('/schedule', methods=['DELETE'])
@tryable_json_endpoint
def remove_scheduled_queue_run():
    remove_scheduled_jobs()
    return "Removed Queued Job"


@bp.route('/now', methods=['POST'])
@tryable_json_endpoint
def now():
    execute_job_now()
    return {"message": "queue has been started"}


@bp.route('/status', methods=['GET'])
@tryable_json_endpoint
def get_queue_status():
    is_running = scheduler_service.get_run_status()
    return {"is_running": is_running}
