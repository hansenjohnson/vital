from flask import Blueprint, request

from model.association.linkage_model import LinkageModel
from settings.settings_service import SettingsService
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('linkages', __name__)
settings_service = SettingsService()
linkage_model = LinkageModel()


@bp.route('', methods=['GET'], strict_slashes=False)
@tryable_json_endpoint
def get_all_linkages():
    return linkage_model.get_all_rows('linkage')


@bp.route('/<int:linkage_id>', methods=['GET'])
@tryable_json_endpoint
def get_linkage(linkage_id):
    return linkage_model.get_linkage_by_id(linkage_id)


@bp.route('', methods=['POST'], strict_slashes=False)
@tryable_json_endpoint
def create_linkage():
    payload = request.json
    linkage_id = linkage_model.create_linkage(payload)
    return {"LinkageId": linkage_id}


@bp.route('/<int:linkage_id>', methods=['PUT'])
@tryable_json_endpoint
def update_linkage(linkage_id):
    payload = request.json
    linkage_model.update_linkage(linkage_id, payload)
    return {"message": "Linkage updated successfully"}


@bp.route('/<int:linkage_id>', methods=['DELETE'])
@tryable_json_endpoint
def delete_linkage_by_id(linkage_id):
    linkage_model.delete_linkage_by_id(linkage_id)
    return {"message": "Linkage deleted successfully"}


@bp.route('/folder', methods=['GET'])
@tryable_json_endpoint
def get_linkages_by_folder():
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')
    observer_code = request.args.get('observer_code')
    linkages = linkage_model.get_linkages_by_folder(year, month, day, observer_code)
    return linkages
