from datetime import datetime, timedelta
from django.db.models import Sum
from backend.api.models import DriverLog


def check_cycle_hours(driver_id):
    """
    Checks if the driver has exceeded 70 hours in the past 8 days.
    Returns True if the driver can continue, otherwise False.
    """
    eight_days_ago = datetime.now() - timedelta(days=8)

    total_hours = DriverLog.objects.filter(
        driver_id=driver_id,
        log_date__gte=eight_days_ago
    ).aggregate(Sum('hours_worked'))['hours_worked__sum'] or 0

    return total_hours < 70  # ✅ True if under limit, False if exceeded

def log_driver_hours(driver_id, travel_duration):
    """
    Logs the driver's trip hours and timestamps.
    """
    dropoff_time = pickup_time + timedelta(minutes=travel_duration) # type: ignore

    DriverLog.objects.create(
        driver_id=driver_id,
        hours_worked=travel_duration / 60,  # Convert minutes to hours
        pickup_time=pickup_time, # type: ignore
        dropoff_time=dropoff_time,
        log_date=datetime.now()
    )

    return dropoff_time 
