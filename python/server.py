from flask import Flask
from flask_cors import CORS

from blueprints.associations_controller.associations import bp as association_bp
from blueprints.settings_controller.settings import bp as settings_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(association_bp, url_prefix='/associations')
app.register_blueprint(settings_bp, url_prefix='/settings')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)