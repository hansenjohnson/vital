from flask import Blueprint, jsonify, request

from services.still_export_service import StillExportService

bp = Blueprint('still_exports', __name__)
still_export_service = StillExportService()


@bp.route('', methods=['POST'], strict_slashes=False)
def create_still_export():
    payload = request.json
    catalog_video_id = payload['CatalogVideoId']
    output_image_name = payload['FileName']
    frame_number = payload['FrameNumber']
    sighting_id = payload['SightingId']

    try:
        still_export_service.create_still(catalog_video_id, output_image_name, frame_number, sighting_id)
        return jsonify({"message": "Still export created successfully"}), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 400
