import sys

from flask import Blueprint, jsonify, request

from model.folder_model import FolderModel
from model.video_model import VideoModel
from model.linkage_model import LinkageModel
from model.sighting_model import SightingModel
from settings.settings_service import SettingsService

bp = Blueprint('settings', __name__)
settings_service = SettingsService()

folder_model = FolderModel()
video_model = VideoModel()
linkage_model = LinkageModel()
sighting_model = SightingModel()


@bp.route('', methods=['POST'], strict_slashes=False)
def create_or_update_settings():
    response, status = jsonify({"message": "An unexpected error occurred"}), 500
    try:
        settings_data = request.json

        for key, value in settings_data.items():
            settings_service.set_setting(key, value)

        refresh_tables()

        response = jsonify({"message": "Setting saved Successfully"})
        status = 200
    except Exception as e:
        sys.stderr.write(f"Failed to save settings: {e}")
        response = jsonify({"Setting save failed ": str(e)})
        status = 500
    finally:
        return response, status


@bp.route('/<key>', methods=['GET'])
def get_settings(key=None):
    response, status = jsonify({"message": "An unexpected error occurred"}), 500
    try:
        setting_value = settings_service.get_setting(key)
        response = jsonify({key: setting_value})
        status = 200
    except Exception as e:
        response = jsonify({"Setting get failed ": str(e)})
        status = 500
    finally:
        return response, status


def refresh_tables():
    folder_model.refresh_table()
    video_model.refresh_table()
    linkage_model.refresh_table()
    sighting_model.refresh_table()
