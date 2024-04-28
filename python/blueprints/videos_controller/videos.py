import os
import sys

from flask import Blueprint, send_from_directory, jsonify
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

bp = Blueprint('videos', __name__)
settings_service = SettingsService()


@bp.route('/<path:file>', methods=['GET'])
def get_video(file):
    folder_path = os.path.join(
        settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS.value),
        settings_service.get_setting(SettingsEnum.CURRENT_VIDEO.value)
    )
    return send_from_directory(str(folder_path), file, as_attachment=False, mimetype='application/dash+xml')


@bp.route('/file_names', methods=['GET'])
def get_file_names():
    folder_of_videos = settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS.value)
    videos = [f for f in os.listdir(folder_of_videos) if os.path.isdir(os.path.join(folder_of_videos, f))]
    return jsonify({"videos": videos})
