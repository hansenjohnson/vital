from flask import Blueprint, jsonify, request
import pandas as pd

bp = Blueprint('excel', __name__)

@bp.route('/read_excel', methods=['POST'])
def read_excel():
    file_path = request.json.get('file_path')
    try:
        df = pd.read_excel(file_path)
        return df.to_json(), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400