import requests # type: ignore


OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/truck/"

def get_route(start, end):
    """
    Fetches route data for a truck from OSRM between start and end.
    Returns a dict containing geometry, distance, duration, and step-by-step instructions.
    """
    try:
        coordinates = f"{start[0]},{start[1]};{end[0]},{end[1]}"
        url = f"{OSRM_BASE_URL}{coordinates}?overview=simplified&geometries=geojson&steps=true"

        response = requests.get(url, timeout=10)  # Prevent hanging requests
        response.raise_for_status()
        data = response.json()

        if "routes" not in data or not data["routes"]:
            return None

        route_data = data["routes"][0]
        return {
            "route": route_data["geometry"],
            "distance": round(route_data["distance"] / 1000, 2),  # Convert meters to km
            "duration": round(route_data["duration"] / 60, 1),  # Convert seconds to minutes
            "instructions": extract_instructions(route_data),
        }

    except requests.RequestException as e:
        print(f"OSRM request failed: {e}")
        return None


def extract_instructions(route):
    """Extracts step-by-step instructions for truck drivers from OSRM route data."""
    instructions = []
    for leg in route.get("legs", []):  # Iterate through route legs
        for step in leg.get("steps", []):  # Extract each step in a leg
            maneuver = step.get("maneuver", {}).get("instruction", "Proceed")
            road = step.get("name", "Unnamed road")
            distance = round(step.get("distance", 0) / 1000, 2)  # Convert meters to km

            instructions.append(f"{maneuver} on {road} ({distance} km)")

    return instructions