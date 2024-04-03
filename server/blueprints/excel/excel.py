from flask import Blueprint, jsonify, request
import pandas as pd

from settings.settings_service import SettingsService

bp = Blueprint('excel', __name__)
settings_service = SettingsService()

@bp.route('/read_excel_file', methods=['GET'])
def read_excel():
    try:
        df = pd.read_excel(settings_service.get_association_file_path())
        return df.to_json(), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@bp.route('/excel_file_path', methods=['POST'])
def write_excel_file_path():
    try:
        file_path = request.json['file_path']
        settings_service.set_association_file_path(file_path)
        return jsonify({"message": "File path saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400