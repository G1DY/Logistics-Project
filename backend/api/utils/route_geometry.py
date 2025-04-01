from geopy.distance import geodesic

def get_location_at_distance(route_geometry, distance):
    """
    Given the route's geometry and a specific distance, calculates the location
    (latitude, longitude) at that distance along the route.
    """
    total_distance = 0
    previous_point = None

    for i, coord in enumerate(route_geometry['coordinates']):
        if previous_point:
            segment_distance = geodesic(previous_point, coord).miles
            total_distance += segment_distance

        if total_distance >= distance:
            return coord  # Return the point at the distance threshold
        
        previous_point = coord
    
    return route_geometry['coordinates'][-1]