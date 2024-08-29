from flask import Blueprint
from settings.settings_service import SettingsService
from model.association.folder_model import FolderModel

from utils.endpoints import tryable_json_endpoint

bp = Blueprint('folders', __name__)
settings_service = SettingsService()
folder_model = FolderModel()


@bp.route('', methods=['GET'], strict_slashes=False)
@tryable_json_endpoint
def get_folders():
    return folder_model.get_all_rows('folder')


@bp.route('/<int:folder_id>', methods=['GET'])
@tryable_json_endpoint
def get_folder_by_id(folder_id):
    return folder_model.get_folder_by_id(folder_id)
