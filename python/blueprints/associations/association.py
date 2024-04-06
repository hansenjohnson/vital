from flask import Blueprint, jsonify, request
import pandas as pd

from model.sql import SQL
from settings.settings_service import SettingsService

bp = Blueprint('association', __name__)
settings_service = SettingsService()
sql = SQL()

@bp.route('/association-file', methods=['GET'])
def read_association_file():
    try:
        return jsonify(sql.get_association_table()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


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


@bp.route('/<int:catalog_video_id>', methods=['GET'])
def get_association(catalog_video_id):
    try:
        return jsonify(sql.get_association_by_id(catalog_video_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/create', methods=['POST'])
def create_association():
    payload = request.json
    try:
        sql.create_association(payload)
        return jsonify({"message": "Association created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
