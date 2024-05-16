from flask import Blueprint, jsonify, request
from model.sighting_model import SightingModel
import sys

bp = Blueprint('sightings', __name__)
sighting_model = SightingModel()


@bp.route('', methods=['GET'], strict_slashes=False)
def get_all_sightings():
    try:
        return jsonify(sighting_model.get_all_rows('sighting')), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:sighting_id>', methods=['GET'])
def get_sighting_by_id(sighting_id):
    try:
        return jsonify(sighting_model.get_sighting_by_id(sighting_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/date', methods=['GET'], strict_slashes=False)
def get_sightings_by_date():
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')
    observer_code = request.args.get('observer_code')

    try:
        return jsonify(sighting_model.get_sightings_by_date(year, month, day, observer_code)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
