from flask import jsonify

from utils.prints import print_error

def tryable_json_endpoint(func):
    def endpoint_handler(*args, **kwargs):
        try:
            response = func(*args, **kwargs)
            return jsonify(response), 200
        except PermissionError as e:
            print_error(str(e))
            return jsonify({"error": str(e), "message": str(e)}), 409
        except Exception as e:
            print_error(str(e))
            return jsonify({"error": str(e), "message": str(e)}), 500
    return endpoint_handler
