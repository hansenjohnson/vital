from flask import Blueprint, jsonify, request
import sys

from model.sql import SQL
from settings.settings_service import SettingsService

bp = Blueprint('associations', __name__)
settings_service = SettingsService()
sql = SQL()


@bp.route('/', methods=['GET'])
def get_all_associations():
    try:
        return jsonify(sql.get_all_associations()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:association_id>', methods=['GET'])
def get_association(association_id):
    try:
        return jsonify(sql.get_association_by_id(association_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/', methods=['POST'])
def create_association():
    payload = request.json
    try:
        association_id = sql.create_association(payload)
        return jsonify({"AssociationId": association_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/<int:association_id>', methods=['DELETE'])
def delete_association_by_id(association_id):
    try:
        sql.delete_association_by_id(association_id)
        return jsonify({"message": "Association deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
