from flask import Blueprint, jsonify
from services.ingest_service import IngestService
from urllib.parse import unquote

bp = Blueprint('ingest', __name__)
ingest_service = IngestService()

@bp.route('/count_files/<string:source_folder_as_encoded_uri_component>', methods=['GET'])
def count_media(source_folder_as_encoded_uri_component):
    try:
        print(source_folder_as_encoded_uri_component)
        source_folder = unquote(source_folder_as_encoded_uri_component)
        return jsonify(ingest_service.count_media(source_folder)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
