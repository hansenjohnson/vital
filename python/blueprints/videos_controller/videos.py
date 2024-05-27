from flask import Blueprint, send_from_directory, jsonify
from settings.settings_service import SettingsService
from model.folder_model import FolderModel
from model.video_model import VideoModel
from settings.settings_enum import SettingsEnum
from utils.file_path import catalog_folder_path

bp = Blueprint('videos', __name__)
settings_service = SettingsService()
video_model = VideoModel()
folder_model = FolderModel()

@bp.route('/<int:catalog_folder_id>/<path:file>', methods=['GET'])
def get_video_by_id(catalog_folder_id, file):
    folder_path = catalog_folder_path(catalog_folder_id, SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)
    return send_from_directory(folder_path, file, as_attachment=False, mimetype='application/dash+xml')


@bp.route('/folders/<int:folder_id>', methods=['GET'])
def get_video_files_by_folder_id(folder_id):
    rows = video_model.get_videos_by_folder_id(folder_id)
    return jsonify({"videos": rows})

