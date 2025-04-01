from rest_framework import serializers # type: ignore
from rest_framework.validators import UniqueValidator # type: ignore
from .models import Truck, Driver, Trip, DriverLog

class DriverLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverLog
        fields = '__all__'

class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = ['id', 'license_plate', 'model', 'capacity', 'status']

class DriverSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=Driver.objects.all())])
    phone_number = serializers.CharField(max_length=15, validators=[UniqueValidator(queryset=Driver.objects.all())])

    class Meta:
        model = Driver
        fields = ['id', 'name', 'phone_number', 'email', 'assigned_truck']

class TripSerializer(serializers.ModelSerializer):
    truck = serializers.PrimaryKeyRelatedField(queryset=Truck.objects.all())
    driver = serializers.PrimaryKeyRelatedField(queryset=Driver.objects.all())

    class Meta:
        model = Trip
        fields = ['id', 'truck', 'driver', 'pickup_location', 'dropoff_location', 'start_time', 'end_time', 'status']
        extra_kwargs = {
            'end_time': {'read_only': True}  # Prevents it from being set on creation
        }