from flask import Blueprint, jsonify, request
from urllib.parse import unquote_plus

from services.thumbnail_service import ThumbnailService

bp = Blueprint('thumbnails', __name__)
thumbnail_service = ThumbnailService()


@bp.route('/<filepath>', methods=['POST'])
def save_thumbnail(filepath):
    try:
        blob = request.get_data()
        filepath_decoded = unquote_plus(filepath)
        thumbnail_service.write_thumbnail(blob, filepath_decoded)
        return jsonify('success'), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
