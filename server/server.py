from flask import Flask, jsonify
from blueprints.excel.excel import bp as excel_bp

app = Flask(__name__)
app.register_blueprint(excel_bp, url_prefix='/excel')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)