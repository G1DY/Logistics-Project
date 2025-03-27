from django.db import models

class Driver(models.Model):
    name = models.CharField(max_length=255)
    carrier = models.CharField(max_length=255)
    office_address = models.TextField()
    home_terminal = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True)
    license_plate = models.CharField(max_length=50, unique=True)
    state = models.CharField(max_length=50)
    total_miles_driven = models.FloatField(default=0)

    def __str__(self):
        return f"{self.license_plate} ({self.state})"


class LogEntry(models.Model):
    STATUS_CHOICES = [
        ('off_duty', 'Off Duty'),
        ('sleeper', 'Sleeper Berth'),
        ('driving', 'Driving'),
        ('on_duty', 'On Duty (not driving)')
    ]
    
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.driver.name} - {self.status} at {self.timestamp}"


class ShippingDocument(models.Model):
    log_entry = models.ForeignKey(LogEntry, on_delete=models.CASCADE)
    manifest_number = models.CharField(max_length=100, unique=True)
    shipment_details = models.TextField()

    def __str__(self):
        return self.manifest_number


class ComplianceRecord(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    total_hours_today = models.FloatField(default=0)
    total_hours_past_7_days = models.FloatField(default=0)
    available_hours_tomorrow = models.FloatField(default=0)
    consecutive_hours_off = models.FloatField(default=0)

    def is_compliant(self):
        return self.total_hours_past_7_days <= 70  

    def __str__(self):
        return f"{self.driver.name} - Compliance for {self.date}"