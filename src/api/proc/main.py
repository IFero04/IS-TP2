import sys
import time

from collections import OrderedDict
from flask import Flask
from flask_cors import CORS

from functions.server_connection import RPCServer
from functions.server_querys import *

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

app = Flask(__name__)
cors = CORS(app)
app.config["DEBUG"] = True
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/listFiles', methods=['GET'])
def list_files_route():
    try:
        with RPCServer() as server:
            result = query_list_files(server)

            response = {
                'status': 'OK!',
                'message': 'Files retrieved successfully!',
                'result': result
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving files!',
            'result': str(e)
        }
        return response, 500


@app.route('/api/teamSeasonStats', methods=['GET'])
def query_team_season_stats_route():
    try:
        with RPCServer() as server:
            result = query_team_season_stats(server)

            response = {
                'status': 'OK!',
                'message': 'Team Season Stats retrieved successfully!',
                'result': result    
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving Team Season Stats!',
            'result': str(e)
        }
        return response, 500


@app.route('/api/tallestCountry', methods=['GET'])
def query_tallest_country_route():
    try:
        with RPCServer() as server:
            result = query_tallest_country(server)

            response = {
                'status': 'OK!',
                'message': 'Tallest Country retrieved successfully!',
                'result': result
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving Tallest Country!',
            'result': str(e)
        }
        return response, 500


@app.route('/api/topPlayers', methods=['GET'])
def query_top_players_route():
    try:
        with RPCServer() as server:
            result = query_top_players(server)

            response = {
                'status': 'OK!',
                'message': 'Top Players retrieved successfully!',
                'result': result
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving Top Players!',
            'result': str(e)
        }
        return response, 500


@app.route('/api/teamPlayers/<season>', methods=['GET'])
def query_team_players_per_season_route(season):
    try:
        with RPCServer() as server:
            result = query_team_players_per_season(server, season)

            response = {
                'status': 'OK!',
                'message': 'Team Players retrieved successfully!',
                'result': result
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving Team Players!',
            'result': str(e)
        }
        return response, 500


@app.route('/api/avgStatsPlayers', methods=['GET'])
def query_avg_stats_players_route():
    try:
        with RPCServer() as server:
            result = query_avg_stats_players(server)

            response = {
                'status': 'OK!',
                'message': 'Average Stats Players retrieved successfully!',
                'result': result
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error retrieving Average Stats Players!',
            'result': str(e)
        }
        return response, 500

@app.route('/api/removeFile/<file_name>', methods=['GET'])
def query_remove_file_route(file_name):
    try:
        with RPCServer() as server:
            result = query_remove_file(server, file_name)

            response = {
                'status': 'OK!',
                'message': 'File removed successfully!',
                'result': result
            }

            return response, 200
    except Exception as e:
        response = {
            'status': 'ERROR!',
            'message': 'Error removing file!',
            'result': str(e)
        }
        return response, 500


if __name__ == '__main__':
    print("Checking server ...")
    while True:
        try:
            with RPCServer() as server:
                break
        except ValueError as e:
            print(f"Error: {e}")
            print("Retrying in 30 seconds ...")
            time.sleep(30)
    print("Server Checked successfully!")

    app.run(host="0.0.0.0", port=PORT)
    