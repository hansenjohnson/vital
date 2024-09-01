from flask import Blueprint, jsonify, request

from model.association.folder_model import FolderModel
from model.association.video_model import VideoModel
from model.association.linkage_model import LinkageModel
from model.association.sighting_model import SightingModel
from model.association.still_export_model import StillExportModel
from model.association.observer_model import ObserverModel
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum
from utils.prints import print_err, print_out
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('settings', __name__)
settings_service = SettingsService()

folder_model = FolderModel()
video_model = VideoModel()
linkage_model = LinkageModel()
sighting_model = SightingModel()
still_export_model = StillExportModel()
observer_model = ObserverModel()


@bp.route('/create_one', methods=['POST'], strict_slashes=False)
def create_or_update_setting():
    response, status = jsonify({"message": "An unexpected error occurred"}), 500
    try:
        key = request.json['key']
        value = request.json['value']
        setting_type = request.json['setting_type']
        print_out(f'attemtpting to save setting: {key} | {value}')

        settings_service.validate_setting(key, value, setting_type)

        settings_service.set_setting(key, value)
        refresh_table_for(key)

        response = jsonify({"message": "Setting saved Successfully"})
        status = 200
    except Exception as e:
        try:
            settings_service.delete_setting(key)
        except Exception as e:
            pass
        print_err(f"Failed to save setting: {e}")
        response = jsonify({'message': str(e)})
        status = 500
    finally:
        return response, status


@bp.route('/open_files', methods=['GET'])
@tryable_json_endpoint
def check_for_open_files():
    linkage_model.flush_to_excel()
    still_export_model.flush_to_excel()
    return ''


@bp.route('/<key>', methods=['GET'])
@tryable_json_endpoint
def get_settings(key=None):
    setting_value = settings_service.get_setting(key)
    return {key: setting_value}


def refresh_table_for(setting_key):
    if setting_key == SettingsEnum.FOLDER_FILE_PATH.value:
        folder_model.refresh_table()
    if setting_key == SettingsEnum.VIDEO_FILE_PATH.value:
        video_model.refresh_table()
    if setting_key == SettingsEnum.LINKAGE_FILE_PATH.value:
        linkage_model.refresh_table()
    if setting_key == SettingsEnum.SIGHTING_FILE_PATH.value:
        sighting_model.refresh_table()
    if setting_key == SettingsEnum.STILL_EXPORT_FILE_PATH.value:
        still_export_model.refresh_table()
    if setting_key == SettingsEnum.OBSERVER_FILE_PATH.value:
        observer_model.refresh_table()
