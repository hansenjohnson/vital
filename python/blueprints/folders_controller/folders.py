from flask import Blueprint, jsonify
from settings.settings_service import SettingsService
from model.folder_model import FolderModel

bp = Blueprint('folders', __name__)
settings_service = SettingsService()
folder_model = FolderModel()


@bp.route('', methods=['GET'], strict_slashes=False)
def get_folders():
    folders = folder_model.get_all_rows('folder')
    return jsonify({"folders": folders})


@bp.route('/<int:folder_id>', methods=['GET'])
def get_folder_by_id(folder_id):
    try:
        return jsonify(folder_model.get_folder_by_id(folder_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
