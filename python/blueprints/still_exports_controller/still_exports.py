from flask import Blueprint, request

from services.still_export_service import StillExportService
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('still_exports', __name__)
still_export_service = StillExportService()


@bp.route('', methods=['POST'], strict_slashes=False)
@tryable_json_endpoint
def create_still_export():
    payload = request.json
    catalog_video_id = payload['CatalogVideoId']
    output_image_name = payload['FileName']
    frame_number = payload['FrameNumber']
    sighting_id = payload['SightingId']

    still_export_service.create_still(catalog_video_id, output_image_name, frame_number, sighting_id)
    return {"message": "Still export created successfully"}
