from flask import Blueprint, jsonify, request
from model.still_export_model import StillExportModel

bp = Blueprint('still_exports', __name__)
still_export_model = StillExportModel()


@bp.route('', methods=['POST'], strict_slashes=False)
def create_still_export():
    payload = request.json
    try:
        still_export_model.create_still_export(payload)
        return jsonify({"message": "Still export created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
