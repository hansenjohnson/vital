import os
import sys

from flask import Blueprint, send_from_directory, jsonify
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum
from model.folder_model import FolderModel
from model.video_model import VideoModel

bp = Blueprint('videos', __name__)
settings_service = SettingsService()
video_model = VideoModel()
folder_model = FolderModel()


@bp.route('/static/<path:catalog_video_id>', methods=['GET'])
def get_video(catalog_video_id):
    folder_path = settings_service.get_setting(SettingsEnum.FOLDER_OF_VIDEOS.value)
    file_path = video_model.get_optimized_video_by_id(catalog_video_id)
    return send_from_directory(folder_path, file_path['OptimizedFileName'], as_attachment=False, mimetype='application/dash+xml')


@bp.route('/<int:folder_id>', methods=['GET'])
def get_video_files_by_folder_id(folder_id):
    rows = video_model.get_videos_by_folder_id(folder_id)
    return jsonify({"videos": rows})


@bp.route('/folders', methods=['GET'])
def get_folders():
    folders = folder_model.get_all_rows('folder')
    return jsonify({"folders": folders})

