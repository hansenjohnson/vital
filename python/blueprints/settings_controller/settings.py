from flask import Blueprint, jsonify, request
import sys

from model.sql import SQL
from settings.settings_service import SettingsService

bp = Blueprint('settings', __name__)
settings_service = SettingsService()
sql = SQL()


@bp.route('/', methods=['POST'])
def create_or_update_settings():
    try:
        settings_data = request.json

        for key, value in settings_data.items():
            settings_service.set_setting(key, value)

        sql.load_sql()

        return jsonify({"message": "Setting saved Successfully"}), 200
    except Exception as e:
        return jsonify({"Setting save failed ": str(e)}), 400
