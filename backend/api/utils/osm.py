import requests # type: ignore

def get_route(start, end):
    """
    Fetches the driving route between start and end coordinates using OSRM.
    
    :param start: Tuple (longitude, latitude) for start point
    :param end: Tuple (longitude, latitude) for end point
    :return: GeoJSON route geometry or None if an error occurs
    """
    base_url = "http://router.project-osrm.org/route/v1/driving/"
    coordinates = f"{start[0]},{start[1]};{end[0]},{end[1]}"
    params = "?overview=full&geometries=geojson"

    try:
        response = requests.get(f"{base_url}{coordinates}{params}")
        response.raise_for_status()
        data = response.json()

        if "routes" in data and data["routes"]:
            return data["routes"][0]["geometry"]

    except requests.RequestException as e:
        print(f"OSM API Error: {e}")

    return None