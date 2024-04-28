from flask import Blueprint, jsonify, request

from model.association_model import AssociationModel
from model.sighting_model import SightingModel
from settings.settings_service import SettingsService

bp = Blueprint('settings', __name__)
settings_service = SettingsService()

association_model = AssociationModel()
sighting_model = SightingModel()


@bp.route('', methods=['POST'], strict_slashes=False)
def create_or_update_settings():
    response, status = jsonify({"message": "An unexpected error occurred"}), 500
    try:
        settings_data = request.json

        for key, value in settings_data.items():
            settings_service.set_setting(key, value)

        refresh_tables()

        response = jsonify({"message": "Setting saved Successfully"})
        status = 200
    except Exception as e:
        response = jsonify({"Setting save failed ": str(e)})
        status = 500
    finally:
        return response, status


@bp.route('/<key>', methods=['GET'])
def get_settings(key=None):
    response, status = jsonify({"message": "An unexpected error occurred"}), 500
    try:
        setting_value = settings_service.get_setting(key)
        response = jsonify({key: setting_value})
        status = 200
    except Exception as e:
        response = jsonify({"Setting get failed ": str(e)})
        status = 500
    finally:
        return response, status


def refresh_tables():
    association_model.refresh_table()
    sighting_model.refresh_table()
