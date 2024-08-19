from flask import Blueprint, jsonify, request
from services.queue_service import schedule_job_run, remove_scheduled_jobs
bp = Blueprint('queue', __name__)



@bp.route('/schedule', methods=['POST'])
def schedule():
    payload = request.json
    try:
        run_date = payload['run_date']
        return jsonify(schedule_job_run(run_date)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/remove', methods=['GET'])
def remove_scheduled_queue_run():
    try:
        remove_scheduled_jobs()
        return jsonify("Removed Queued Job"), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400