from flask import Blueprint, jsonify, request
from services.queue_service import schedule_job_run, remove_scheduled_jobs, execute_job_now

from services.scheduler_service import SchedulerService

bp = Blueprint('queue', __name__)

scheduler_service = SchedulerService()

@bp.route('/schedule', methods=['POST'])
def schedule():
    payload = request.json
    try:
        run_date = payload['run_date']
        return jsonify(schedule_job_run(run_date)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/now', methods=['POST'])
def now():
    try:
        execute_job_now()
        return jsonify({"message": "queue has been started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/remove', methods=['GET'])
def remove_scheduled_queue_run():
    try:
        remove_scheduled_jobs()
        return jsonify("Removed Queued Job"), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/status', methods=['GET'])
def get_queue_status():
    try:
        is_running = scheduler_service.get_run_status()
        return jsonify({"is_running": is_running}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400