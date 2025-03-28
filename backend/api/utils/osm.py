import requests # type: ignore

OSRM_BASE_URL = "https://www.openstreetmap.org/#map=6/0.17/37.90"

def get_route(start, end):
    """
    Fetches the route from OpenStreetMap's OSRM API.
    :param start: Tuple (longitude, latitude) for start location.
    :param end: Tuple (longitude, latitude) for destination.
    :return: JSON response with route details.
    """
    url = f"{OSRM_BASE_URL}/{start[0]},{start[1]};{end[0]},{end[1]}?overview=full&geometries=geojson"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        return None