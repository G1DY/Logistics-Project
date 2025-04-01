from geopy.distance import geodesic

def test_geopy_distance():
    pickup_coords = (34.0522, -118.2437)  # Example: Los Angeles coordinates
    dropoff_coords = (36.1699, -115.1398)  # Example: Las Vegas coordinates

    distance = geodesic(pickup_coords, dropoff_coords).kilometers
    print(f"Distance between pickup and dropoff: {distance} km")

# Call the function
test_geopy_distance()