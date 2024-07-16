from flask import Blueprint, send_from_directory, jsonify, request
from settings.settings_service import SettingsService
from model.folder_model import FolderModel
from model.video_model import VideoModel
from settings.settings_enum import SettingsEnum
from utils.file_path import catalog_folder_path
from utils.file_path import video_file_path

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


@bp.route('/path/<int:catalog_video_id>', methods=['GET'])
def get_video_file_path(catalog_video_id):
    base = SettingsEnum.BASE_FOLDER_OF_VIDEOS.value
    column = 'OptimizedFileName'

    file_path = video_file_path(catalog_video_id, base, column)
    return jsonify({"file_path": file_path})


@bp.route('/<int:catalog_video_id>', methods=['PUT'])
def update_video(catalog_video_id):
    payload = request.json
    try:
        video_model.update_video(catalog_video_id, payload)
        return jsonify({"message": "Video updated successfully"}), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 400
