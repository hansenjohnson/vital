from flask import Flask, jsonify
from blueprints.associations.association import bp as association_bp

app = Flask(__name__)
app.register_blueprint(association_bp, url_prefix='/association')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)