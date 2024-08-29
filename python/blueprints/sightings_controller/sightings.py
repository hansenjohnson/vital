from flask import Blueprint, request

from model.association.sighting_model import SightingModel
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('sightings', __name__)
sighting_model = SightingModel()


@bp.route('', methods=['GET'], strict_slashes=False)
@tryable_json_endpoint
def get_all_sightings():
    return sighting_model.get_all_rows('sighting')


@bp.route('/<int:sighting_id>', methods=['GET'])
@tryable_json_endpoint
def get_sighting_by_id(sighting_id):
    return sighting_model.get_sighting_by_id(sighting_id)


@bp.route('/date', methods=['GET'], strict_slashes=False)
@tryable_json_endpoint
def get_sightings_by_date():
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')
    observer_code = request.args.get('observer_code')
    return sighting_model.get_sightings_by_date(year, month, day, observer_code)
