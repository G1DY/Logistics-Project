from django.db import models

class Trip(models.Model):
    pickup = models.CharField(max_length=255)  # Pickup location (text input)
    dropoff = models.CharField(max_length=255)  # Dropoff location (text input)
    pickup_coords = models.JSONField()  # Store (latitude, longitude) as JSON
    dropoff_coords = models.JSONField()  # Store (latitude, longitude) as JSON
    start_time = models.DateTimeField(auto_now_add=True)  # Timestamp when trip starts

    class Meta:
        abstract = True  # This will not create a separate table


class ActiveTrip(Trip):
    current_location = models.JSONField()  # Real-time coordinates (lat, lng)
    current_cycle_used = models.FloatField(default=0)  # Hours used so far
    last_updated = models.DateTimeField(auto_now=True)  # Auto-update on every change

    def __str__(self):
        return f"ActiveTrip from {self.pickup} to {self.dropoff}"


class TripHistory(Trip):
    completed_time = models.DateTimeField(auto_now_add=True)  # When trip was completed
    total_distance = models.FloatField(null=True, blank=True)  # Distance in km
    total_duration = models.FloatField(null=True, blank=True)  # Duration in minutes

    def __str__(self):
        return f"Completed trip from {self.pickup} to {self.dropoff}"