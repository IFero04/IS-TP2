from utilis.db import PostgresDB
import math
import random


def _get_country(country_id):
    try:
        with PostgresDB('db-rel', '5432', 'is', 'is', 'is') as db:
            query = """SELECT * FROM countries WHERE id = %s"""
            parameters = (country_id,)

            result = db.execute_query(query, parameters, multi=False)

            return {'id': result[0], 'name': result[1], 'coordinates': result[2]}
    except Exception as e:
        raise Exception(e)
    

def _get_players_by_country(country_id):
    try:
        with PostgresDB('db-rel', '5432', 'is', 'is', 'is') as db:
            query = """SELECT id, name, age, height, weight, draftyear
                FROM players WHERE country_ref = %s
            """
            parameters = (country_id,)

            result = db.execute_query(query, parameters)

            response = []
            for item in result:
                response.append({
                    'id': item[0],
                    'name': item[1],
                    'age': item[2],
                    'height': item[3],
                    'weight': item[4],
                    'draft_year': item[5]
                })
            
            return response
    except Exception as e:
        raise Exception(e)
    

def _change_cords(cords, radius):
    x_center, y_center = cords

    angle = 2 * math.pi * random.random()

    x_point = x_center + radius * math.cos(angle)
    y_point = y_center + radius * math.sin(angle)

    return x_point, y_point
    

def update_country_coordinates(country_id, data):
    try:
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is not None and longitude is not None:
            with PostgresDB('db-rel', '5432', 'is', 'is', 'is') as db:
                query = """UPDATE countries SET coordinates = ST_MakePoint(%s, %s) WHERE id = %s"""
                parameters = (latitude, longitude, country_id, )
                db.execute_query(query, parameters, fetch=False)

            country = _get_country(country_id)

            return country
        else:
            raise Exception("Latitude and longitude are required")
    except Exception as e:
        raise Exception(e)


def get_markers(args):
    try:
        neLat = args["neLat"]
        neLng = args["neLng"]
        swLat = args["swLat"]
        swLng = args["swLng"]

        if neLat is not None and neLng is not None and swLat is not None and swLng is not None:
            with PostgresDB('db-rel', '5432', 'is', 'is', 'is') as db:
                query = """SELECT id, name, ST_AsGeoJSON(coordinates)::jsonb as geometry
                    FROM (
                        SELECT id, name, coordinates FROM countries WHERE ST_Intersects(coordinates, ST_MakeEnvelope(%s, %s, %s, %s))
                    ) AS subquery
                """

                parameters = (neLng, neLat, swLng, swLat, )

                result = db.execute_query(query, parameters)

                response = []
                for item in result:
                    country_id = item[0]
                    country_name = item[1]
                    geometry = item[2]

                    players = _get_players_by_country(country_id)

                    for player in players:
                        radius = 0.10
                        player_cords = _change_cords(geometry['coordinates'], radius)

                        response.append({
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': player_cords
                            },
                            'properties': {
                                'id': player['id'],
                                'name': player['name'],
                                'age': player['age'],
                                'country': country_name,
                                'height': player['height'],
                                'weight': player['weight'],
                                'draft_year': player['draft_year']
                            }
                        })

                        radius += 0.10
                    
            
                return response
        else:
            raise Exception("neLat, neLng, swLat and swLng are required")
    except Exception as e:
        raise Exception(e)
