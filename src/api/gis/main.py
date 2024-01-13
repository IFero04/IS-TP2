import sys
import time
from flask import Flask, jsonify, request
from utilis.db import PostgresDB, check_db
from utilis.api import get_markers, update_country_coordinates

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/api/check', methods=['GET'])
def check_route():
    try:
        response = {
            'status': 'OK!',
            'message': 'GIS API is running!'
        }

        return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error checking GIS API!',
            'result': str(e)
        }
        return response, 500
    

@app.route('/api/tile', methods=['GET'])
def get_markers_route():
    try:
        args = request.args

        result = get_markers(args)

        response = {
            'status': 'OK!',
            'message': 'Markers retrieved successfully!',
            'result': result    
        }

        return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving markers!',
            'result': str(e)
        }
        return response, 500


@app.route("/api/country/<id>", methods=["PATCH"])
def update_country_coordinates_route(id):
    try:
        data = request.get_json()

        result = update_country_coordinates(id, data)

        response = {
            'status': 'OK!',
            'message': 'Country coordinates updated successfully!',
            'result': result    
        }

        return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error updating country coordinates!',
            'result': str(e)
        }
        return response, 500


if __name__ == '__main__':
    print("Loading DataBase ...")
    while not check_db():
        print("Retrying in 30 seconds ...")
        time.sleep(30)
    print("DataBase loaded.")

    app.run(host="0.0.0.0", port=PORT)
