from rest_framework import serializers # type: ignore
from rest_framework.validators import UniqueValidator # type: ignore
from .models import Truck, Driver, Trip, DriverLog
from django.contrib.auth import authenticate

# Truck Serializer
class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = ['id', 'license_plate', 'model', 'capacity', 'status']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials')
        return user


# Driver Serializer
class DriverSerializer(serializers.ModelSerializer):
    assigned_truck = TruckSerializer(read_only=True)  # Nesting Truck serializer

    class Meta:
        model = Driver
        fields = ['id', 'name', 'phone_number', 'email', "password", 'assigned_truck']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if password is None:
            raise serializers.ValidationError({"password": "This field is required."})
        driver = Driver.objects.create_user(**validated_data, password=password)
        return driver


# Driver Log Serializer
class DriverLogSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(read_only=True)  # Nested Driver serializer

    class Meta:
        model = DriverLog
        fields = [
            'id', 'driver', 'log_date', 'hours_worked', 'stops', 'rest_hours',
            'fuel_stop_locations', 'fueling_count', 'distance_covered',
            'pickup_time', 'dropoff_time'
        ]


# Trip Serializer
class TripSerializer(serializers.ModelSerializer):
    truck = TruckSerializer(read_only=True)  # Nested Truck serializer
    driver = DriverSerializer(read_only=True)  # Nested Driver serializer

    class Meta:
        model = Trip
        fields = [
            'id', 'truck', 'driver', 'pickup_location', 'dropoff_location',
            'start_time', 'end_time', 'status'
        ]