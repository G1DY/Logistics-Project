from django.db import models

class TruckStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    INACTIVE = "inactive", "Inactive"


class Truck(models.Model):
    license_plate = models.CharField(max_length=15, unique=True, db_index=True)
    model = models.CharField(max_length=50)
    capacity = models.FloatField(help_text="Capacity in tons")
    status = models.CharField(
        max_length=10,
        choices=TruckStatus.choices,
        default=TruckStatus.ACTIVE
    )

    def __str__(self):
        return f"{self.model} - {self.license_plate}"

class Driver(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True, db_index=True)
    assigned_truck = models.OneToOneField(Truck, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class DriverLog(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, default=1)   # Unique driver identifier
    log_date = models.DateField(auto_now_add=True)  # Log date
    hours_worked = models.FloatField(default=0.0)  # Total driving hours for the day
    stops = models.IntegerField(default=0)  # Number of stops
    rest_hours = models.FloatField(default=0.0)  # Total rest time in hours
    fuel_stop_locations = models.JSONField(default=list)
    fueling_count = models.IntegerField(default=0) # Number of fuel stops
    distance_covered = models.FloatField(default=0.0)  # Distance in miles
    pickup_time = models.DateTimeField(null=True, blank=True)  # Pickup time in hours
    dropoff_time = models.DateTimeField(null=True, blank=True)  # Drop-off time in hours

    def __str__(self):
        return f"Driver {self.driver} - {self.log_date}"


class TripStatus(models.TextChoices):
    ONGOING = "ongoing", "Ongoing"
    COMPLETED = "completed", "Completed"


class Trip(models.Model):
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now=True, null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=TripStatus.choices,
        default=TripStatus.ONGOING
    )

    def __str__(self):
        return f"Trip {self.id}: {self.pickup_location} → {self.dropoff_location} ({self.status})"