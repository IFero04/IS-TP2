import requests


def check_api():
    try:
        url = "http://api-gis:8080/api/check"
        response = requests.get(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return False
    

def get_coords(country):
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={country}&format=json"
        response = requests.get(url)
        data = response.json()
        if data:
            latitude = float(data[0]['lat'])
            longitude = float(data[0]['lon'])
            return latitude, longitude
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


def update_country_coordinates(id, data):
    try:
        url = f"http://api-gis:8080/api/country/{id}"
        response = requests.patch(url, json=data)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return False