from flask import Blueprint, jsonify, request
import sys

from model.sql import SQL
from settings.settings_service import SettingsService

bp = Blueprint('settings', __name__)
settings_service = SettingsService()
sql = SQL()


@bp.route('/association-file', methods=['POST'])
def write_association_file():
    try:
        file_path = request.json['file_path']
        sheet_name = request.json['sheet_name']

        settings_service.set_association_file_path(file_path)
        settings_service.set_association_sheet_name(sheet_name)

        sql.load_sql()

        return jsonify({"message": "File path saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400