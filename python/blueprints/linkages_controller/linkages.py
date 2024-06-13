from flask import Blueprint, jsonify, request

from model.linkage_model import LinkageModel
from settings.settings_service import SettingsService

bp = Blueprint('linkages', __name__)
settings_service = SettingsService()
linkage_model = LinkageModel()


@bp.route('', methods=['GET'], strict_slashes=False)
def get_all_linkages():
    try:
        return jsonify(linkage_model.get_all_rows('linkage')), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:linkage_id>', methods=['GET'])
def get_linkage(linkage_id):
    try:
        return jsonify(linkage_model.get_linkage_by_id(linkage_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('', methods=['POST'], strict_slashes=False)
def create_linkage():
    payload = request.json
    try:
        linkage_id = linkage_model.create_linkage(payload)
        return jsonify({"LinkageId": linkage_id}), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:linkage_id>', methods=['PUT'])
def update_linkage(linkage_id):
    payload = request.json
    try:
        linkage_model.update_linkage(linkage_id, payload)
        return jsonify({"message": "Linkage updated successfully"}), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:linkage_id>', methods=['DELETE'])
def delete_linkage_by_id(linkage_id):
    try:
        linkage_model.delete_linkage_by_id(linkage_id)
        return jsonify({"message": "Linkage deleted successfully"}), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/folder', methods=['GET'])
def get_linkages_by_folder():
    try:
        year = request.args.get('year')
        month = request.args.get('month')
        day = request.args.get('day')
        observer_code = request.args.get('observer_code')

        linkages = linkage_model.get_linkages_by_folder(year, month, day, observer_code)
        return jsonify(linkages), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
