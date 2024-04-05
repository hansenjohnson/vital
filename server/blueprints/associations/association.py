from flask import Blueprint, jsonify, request
import pandas as pd

from settings.settings_service import SettingsService

bp = Blueprint('association', __name__)
settings_service = SettingsService()

@bp.route('/association-file', methods=['GET'])
def read_association_file():
    df =  pd.read_excel(settings_service.get_association_file_path(), settings_service.get_association_sheet_name())
    if (df is not None):
        try:
            return df.to_json(), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    else:
        return jsonify({"error": "No file path set"}), 400
    

@bp.route('/association-file', methods=['POST'])
def write_assciation_file():
    df =  pd.read_excel(settings_service.get_association_file_path(), settings_service.get_association_sheet_name())
    try:
        file_path = request.json['file_path']
        sheet_name = request.json['sheet_name']

        settings_service.set_association_file_path(file_path)
        settings_service.set_association_sheet_name(sheet_name)

        return jsonify({"message": "File path saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@bp.route('/<int:id>', methods=['GET'])
def get_association(id):
    df =  pd.read_excel(settings_service.get_association_file_path(), settings_service.get_association_sheet_name())
    try: 
        return jsonify( df.loc[df['CatalogVideoId'] == id].to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
