from datetime import datetime, timedelta
from django.db.models import Sum
from api.models import Driver, DriverLog
from api.utils.route_geometry import get_location_at_distance
from django.utils import timezone



def check_cycle_hours(driver_id):
    """
    Checks if the driver has exceeded 70 hours in the past 8 days.
    Returns True if the driver can continue, otherwise False.
    """
    eight_days_ago = timezone.now() - timedelta(days=8)

    total_hours = DriverLog.objects.filter(
        driver_id=driver_id,
        log_date__gte=eight_days_ago
    ).aggregate(Sum('hours_worked'))['hours_worked__sum'] or 0
    print(f"DEBUG: Driver {driver_id} has worked {total_hours} hours in the past 8 days.")

    return total_hours < 70  # ✅ True if under limit, False if exceeded

def log_driver_hours(driver_id, travel_duration, pickup_time, distance, route_geometry):
    """
    Logs the driver's trip hours, timestamps, fuel stops, and their locations.
    """
    dropoff_time = pickup_time + timedelta(minutes=travel_duration)

    # 🚛⛽ Auto-calculate fuel stops (assuming refueling every 1000 miles)
    fuel_stop_interval = 1000  # in miles
    fueling_count = max(1, int(distance // fuel_stop_interval))
    
    fuel_stop_locations = []

    # 🚛 Calculate fuel stop locations based on route geometry
    if fueling_count > 0:
        for i in range(1, fueling_count + 1):
            # Calculate the distance of each fuel stop along the route
            stop_distance = i * fuel_stop_interval  # miles
            stop_lat, stop_lng = get_location_at_distance(route_geometry, stop_distance)
            fuel_stop_locations.append((stop_lat, stop_lng))

    # Create the log entry
    DriverLog.objects.create(
        driver_id=driver_id,
        hours_worked=travel_duration / 60,  # Convert minutes to hours
        pickup_time=pickup_time,
        dropoff_time=dropoff_time,
        distance_covered=distance,
        fueling_count=fueling_count,
        fuel_stop_locations=fuel_stop_locations,  # Store fuel stop locations
        log_date=timezone.now()
    )

    return dropoff_time, fueling_count, fuel_stop_locations