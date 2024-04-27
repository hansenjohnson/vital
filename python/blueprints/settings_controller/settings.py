from flask import Blueprint, jsonify, request

from model.sql import SQL
from settings.settings_service import SettingsService

bp = Blueprint('settings', __name__)
settings_service = SettingsService()
sql = SQL()


@bp.route('', methods=['POST'], strict_slashes=False)
def create_or_update_settings():
    try:
        settings_data = request.json

        for key, value in settings_data.items():
            settings_service.set_setting(key, value)

        sql.load_sql()

        response = jsonify({"message": "Setting saved Successfully"})
        status = 200
    except Exception as e:
        response = jsonify({"Setting save failed ": str(e)})
        status = 500
    finally:
        return response, status


@bp.route('/<key>', methods=['GET'])
def get_settings(key=None):
    try:
        setting_value = settings_service.get_setting(key)
        response = jsonify({key: setting_value})
        status = 200
    except Exception as e:
        response = jsonify({"Setting get failed ": str(e)})
        status = 500
    finally:
        return response, status
