from flask import Blueprint, jsonify, request
from services.queue_service import schedule_job_run

bp = Blueprint('queue', __name__)



@bp.route('/schedule', methods=['POST'])
def schedule():
    payload = request.json
    try:
        run_date = payload['run_date']
        return jsonify(schedule_job_run(run_date)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
