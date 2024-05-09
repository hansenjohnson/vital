import os
import sys

from flask import Blueprint, send_from_directory, jsonify
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum
from model.folder_model import FolderModel
from model.video_model import VideoModel
from utils.file_path import catalog_folder_path

bp = Blueprint('videos', __name__)
settings_service = SettingsService()
video_model = VideoModel()
folder_model = FolderModel()


@bp.route('/static/<path:file>', methods=['GET'])
def get_video(file):
    folder_path = os.path.join(
        settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS.value),
        settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_VIDEOS.value),
        '2020-2029\\2021\\2021-07-19-GLL',
        settings_service.get_setting(SettingsEnum.CURRENT_VIDEO.value)
    )
    return send_from_directory(str(folder_path), file, as_attachment=False, mimetype='application/dash+xml')

# @bp.route('/<int:catalog_video_id>', methods=['GET'])
# def get_video(catalog_video_id):
#     file_path = video_model.get_optimized_video_by_id(catalog_video_id)
#     sys.stderr.write(f"{file_path}")
#     folder_path = catalog_folder_path(file_path['CatalogFolderId'])
#     sys.stderr.write(f"{folder_path}\\{file_path['OptimizedFileName']}")
#
#     return send_from_directory(folder_path, file_path['OptimizedFileName'], as_attachment=False, mimetype='application/dash+xml')


@bp.route('/folders/<int:folder_id>', methods=['GET'])
def get_video_files_by_folder_id(folder_id):
    rows = video_model.get_videos_by_folder_id(folder_id)
    return jsonify({"videos": rows})

