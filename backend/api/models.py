from django.db import models

class Truck(models.Model):
    license_plate = models.CharField(max_length=15, unique=True)
    model = models.CharField(max_length=50)
    capacity = models.FloatField(help_text="Capacity in tons")
    status = models.CharField(
        max_length=10,
        choices=[("active", "Active"), ("inactive", "Inactive")],
        default="active"
    )

    def __str__(self):
        return f"{self.model} - {self.license_plate}"


class Driver(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    assigned_truck = models.OneToOneField(Truck, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class Trip(models.Model):
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=[("ongoing", "Ongoing"), ("completed", "Completed")],
        default="ongoing"
    )

    def __str__(self):
        return f"Trip {self.id} - {self.truck.license_plate} ({self.status})"