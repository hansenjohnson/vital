import os
from flask import Blueprint, request, send_from_directory
from urllib.parse import unquote_plus

from services.thumbnail_service import ThumbnailService
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('thumbnails', __name__)
thumbnail_service = ThumbnailService()
settings_service = SettingsService()


@bp.route('/<filepath>', methods=['POST'])
@tryable_json_endpoint
def save_thumbnail(filepath):
    blob = request.get_data()
    filepath_decoded = unquote_plus(filepath)
    thumbnail_service.write_thumbnail(blob, filepath_decoded)
    return 'success'

@bp.route('/<filepath>', methods=['GET'])
def serve_thumbnail(filepath):
    filepath_decoded = unquote_plus(filepath)
    base_path = settings_service.get_setting(SettingsEnum.THUMBNAIL_DIR_PATH.value)
    thumbnail_path = os.path.join(base_path, filepath_decoded)
    directory_path = os.path.dirname(thumbnail_path)
    thumbnail_filename = os.path.basename(thumbnail_path)
    return send_from_directory(directory_path, thumbnail_filename, as_attachment=False)
