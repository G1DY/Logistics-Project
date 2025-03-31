import requests # type: ignore

def get_route(start, end):
    """
    Fetches route data from OSRM between start and end.
    Returns a dict containing geometry, distance, duration, and instructions.
    """
    base_url = "http://router.project-osrm.org/route/v1/driving/"
    coordinates = f"{start[0]},{start[1]};{end[0]},{end[1]}"
    params = "?overview=simplified&geometries=geojson&steps=true"

    response = requests.get(f"{base_url}{coordinates}{params}")
    response.raise_for_status()
    data = response.json()

    if "routes" not in data or not data["routes"]:
        return None

    route_data = data["routes"][0]
    return {
        "geometry": route_data["geometry"],
        "distance": route_data["distance"],
        "duration": route_data["duration"],
        "instructions": [step["maneuver"]["instruction"] for step in route_data["legs"][0]["steps"]],
    }