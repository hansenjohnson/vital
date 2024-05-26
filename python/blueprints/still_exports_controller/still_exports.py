from flask import Blueprint, jsonify, request
from model.still_export_model import StillExportModel
from services.still_export_service import StillExportService

bp = Blueprint('still_exports', __name__)
still_export_model = StillExportModel()
still_frame_service = StillExportService()


@bp.route('', methods=['POST'], strict_slashes=False)
def create_still_export():
    payload = request.json
    try:
        still_export_model.create_still_export(payload)
        still_frame_service.extract_frame(payload['CatalogVideoId'], payload['FileLocation'], payload['FileName'], payload['FrameNumber'])
        return jsonify({"message": "Still export created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
