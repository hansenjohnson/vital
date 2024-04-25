from flask import Blueprint, jsonify, request, send_from_directory
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

bp = Blueprint('videos', __name__)
settings_service = SettingsService()


@bp.route('/<path:filename>', methods=['GET'])
def video(filename):
    return send_from_directory(settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS_TO_CREATE.value), filename)

