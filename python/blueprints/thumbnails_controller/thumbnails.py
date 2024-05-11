import os
from flask import Blueprint, jsonify, request
from urllib.parse import unquote_plus

from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

bp = Blueprint('thumbnails', __name__)
settings_service = SettingsService()


@bp.route('/<filepath>', methods=['POST'])
def save_thumbnail(filepath):
    try:
        blob = request.get_data()
        thumbnail_dir_path = settings_service.get_setting(SettingsEnum.THUMBNAIL_DIR_PATH.value)
        filepath_decoded = unquote_plus(filepath)
        final_file_path = os.path.join(thumbnail_dir_path, filepath_decoded)

        final_file_dir = os.path.dirname(final_file_path)
        os.makedirs(final_file_dir, exist_ok=True)
        with open(final_file_path, 'wb') as aFile:
            aFile.write(blob)

        return jsonify(final_file_path), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
