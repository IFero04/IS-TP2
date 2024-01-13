from utilis.db import PostgresDB


def _get_country(country_id):
    try:
        with PostgresDB('db-rel', '5432', 'is', 'is', 'is') as db:
            query = """SELECT * FROM countries WHERE id = %s"""
            parameters = (country_id,)

            result = db.execute_query(query, parameters, multi=False)

            return {'id': result[0], 'name': result[1], 'coordinates': result[2]}
    except Exception as e:
        raise Exception(e)
    
    
def update_country_coordinates(country_id, data):
    try:
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is not None and longitude is not None:
            with PostgresDB('db-rel', '5432', 'is', 'is', 'is') as db:
                query = """UPDATE countries SET coordinates = ST_MakePoint(%s, %s) WHERE id = %s"""
                parameters = (longitude, latitude, country_id, )
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
                query = """SELECT jsonb_build_object(
                    'type', 'Feature',
                    'id', id,
                    'geometry', ST_AsGeoJSON(coordinates)::jsonb,
                    'properties', to_jsonb(t.*) - 'id' - 'coordinates'
                    ) AS json
                        FROM (SELECT id, name, coordinates FROM countries WHERE ST_Intersects(coordinates, ST_MakeEnvelope(%s, %s, %s, %s))) AS t(id, name, coordinates)
                """
                parameters = (neLng, neLat, swLng, swLat, )

                result = db.execute_query(query, parameters, multi=True)

                return result
        else:
            raise Exception("neLat, neLng, swLat and swLng are required")
    except Exception as e:
        raise Exception(e)
