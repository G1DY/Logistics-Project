from django.contrib import admin
from .models import Driver, Truck, DriverLog, Trip

# Register your models here

class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'is_active', 'assigned_truck')
    search_fields = ('name', 'email', 'phone_number')
    list_filter = ('is_active', 'assigned_truck')

class TruckAdmin(admin.ModelAdmin):
    list_display = ('license_plate', 'model', 'capacity', 'status')
    search_fields = ('license_plate', 'model')
    list_filter = ('status',)

class DriverLogAdmin(admin.ModelAdmin):
    list_display = ('driver', 'log_date', 'hours_worked', 'distance_covered', 'stops')
    search_fields = ('driver__name', 'log_date')
    list_filter = ('log_date',)

class TripAdmin(admin.ModelAdmin):
    list_display = ('driver', 'truck', 'pickup_location', 'dropoff_location', 'start_time', 'status')
    search_fields = ('driver__name', 'truck__license_plate', 'pickup_location', 'dropoff_location')
    list_filter = ('status', 'start_time')

# Register the models with the custom admin classes
admin.site.register(Driver, DriverAdmin)
admin.site.register(Truck, TruckAdmin)
admin.site.register(DriverLog, DriverLogAdmin)
admin.site.register(Trip, TripAdmin)