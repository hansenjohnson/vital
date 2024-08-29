import os
from flask import Blueprint, send_from_directory, request

from settings.settings_service import SettingsService
from model.association.folder_model import FolderModel
from model.association.video_model import VideoModel
from settings.settings_enum import SettingsEnum
from utils.file_path import catalog_folder_path
from utils.file_path import video_file_path
from utils.prints import print_err
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('videos', __name__)
settings_service = SettingsService()
video_model = VideoModel()
folder_model = FolderModel()


@bp.route('/<int:catalog_folder_id>/<path:file>', methods=['GET'])
def get_video_by_id(catalog_folder_id, file):
    folder_path = catalog_folder_path(catalog_folder_id, SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)
    expectedFile = os.path.join(folder_path, file)
    if not os.path.exists(expectedFile):
        print_err(f'the expectedFile does not exist, maybe the parent folders have something else')
        print_err(f'{folder_path} --- {os.listdir(folder_path)}')
        print_err(f'{os.path.dirname(expectedFile)} --- {os.listdir(os.path.dirname(expectedFile))}')
    return send_from_directory(folder_path, file, as_attachment=False, mimetype='application/dash+xml')


@bp.route('/folders/<int:folder_id>', methods=['GET'])
@tryable_json_endpoint
def get_video_files_by_folder_id(folder_id):
    rows = video_model.get_videos_by_folder_id(folder_id)
    return {"videos": rows}


@bp.route('/path/<int:catalog_video_id>', methods=['GET'])
@tryable_json_endpoint
def get_video_file_path(catalog_video_id):
    base = SettingsEnum.BASE_FOLDER_OF_VIDEOS.value
    column = 'OptimizedFileName'
    file_path = video_file_path(catalog_video_id, base, column)
    return {"file_path": file_path}


@bp.route('/<int:catalog_video_id>', methods=['PUT'])
@tryable_json_endpoint
def update_video(catalog_video_id):
    payload = request.json
    video_model.update_video(catalog_video_id, payload)
    return {"message": "Video updated successfully"}
