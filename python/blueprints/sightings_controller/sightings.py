from flask import Blueprint, jsonify, request

from model.sql import SQL
from settings.settings_service import SettingsService
from model.sighting_model import SightingModel

bp = Blueprint('sightings', __name__)
settings_service = SettingsService()
sighting_model = SightingModel()


@bp.route('', methods=['GET'], strict_slashes=False)
def get_all_sightings():
    try:
        return jsonify(sighting_model.get_all_sightings()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:sighting_id>', methods=['GET'])
def get_sighting_by_id(sighting_id):
    try:
        return jsonify(sighting_model.get_sighting_by_id(sighting_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
