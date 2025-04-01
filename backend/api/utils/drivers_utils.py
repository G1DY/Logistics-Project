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
    Logs the hours worked by the driver after a trip.
    """
    DriverLog.objects.create(
        driver_id=driver_id,
        hours_worked=travel_duration / 60,  # ✅ Convert minutes to hours correctly
        log_date=datetime.now()
    )
