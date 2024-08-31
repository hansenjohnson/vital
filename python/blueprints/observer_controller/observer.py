from flask import Blueprint, request

from model.association.observer_model import ObserverModel
from utils.endpoints import tryable_json_endpoint

bp = Blueprint('observers', __name__)

observer_model = ObserverModel()

@bp.route('', methods=['GET'], strict_slashes=False)
@tryable_json_endpoint
def get_all_observers():
    return observer_model.get_all_observers()
