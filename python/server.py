from flask import Flask
from flask_cors import CORS

from blueprints.linkages_controller.linkages import bp as linkages_bp
from blueprints.sightings_controller.sightings import bp as sightings_bp
from blueprints.settings_controller.settings import bp as settings_bp
from blueprints.videos_controller.videos import bp as videos_bp
from blueprints.folders_controller.folders import bp as folders_bp
from blueprints.thumbnails_controller.thumbnails import bp as thumbnails_bp
from blueprints.still_exports_controller.still_exports import bp as still_exports_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(linkages_bp, url_prefix='/linkages')
app.register_blueprint(sightings_bp, url_prefix='/sightings')
app.register_blueprint(settings_bp, url_prefix='/settings')
app.register_blueprint(videos_bp, url_prefix='/videos')
app.register_blueprint(folders_bp, url_prefix='/folders')
app.register_blueprint(thumbnails_bp, url_prefix='/thumbnails')
app.register_blueprint(still_exports_bp, url_prefix='/still_exports')


@app.route('/ping', methods=['GET'])
def ping():
    return 'pong'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
