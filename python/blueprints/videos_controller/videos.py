import os

from flask import Blueprint, send_from_directory, jsonify
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

bp = Blueprint('videos', __name__)
settings_service = SettingsService()


@bp.route('/<path:foldername>/<path:filename>', methods=['GET'])
def video(folder_name, filename):
    file_path = str(os.path.join(folder_name, filename))
    return send_from_directory(settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS.value), file_path)


@bp.route('/file_names', methods=['GET'])
def get_file_names():
    folder_of_videos = settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS.value)
    file_names = [f for f in os.listdir(folder_of_videos) if os.path.isfile(os.path.join(folder_of_videos, f))]
    return jsonify(file_names)
