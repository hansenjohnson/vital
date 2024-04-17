from flask import Blueprint, jsonify, request
import sys

from model.sql import SQL
from settings.settings_service import SettingsService

bp = Blueprint('settings', __name__)
settings_service = SettingsService()
sql = SQL()

@bp.route('', methods=['OPTIONS'], strict_slashes=False)
def options():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response, 200

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
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        return response, status
