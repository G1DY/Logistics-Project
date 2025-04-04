from rest_framework import serializers # type: ignore
from rest_framework.validators import UniqueValidator # type: ignore
from .models import Truck, Driver, Trip, DriverLog
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email  # ✅ Add email to the token
        return token

# Truck Serializer
class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = ['id', 'license_plate', 'model', 'capacity', 'status']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # We authenticate using the email field since USERNAME_FIELD is 'email' in the Driver model
        driver = authenticate(email=email, password=password)
        if not driver:
            raise serializers.ValidationError('Invalid credentials')
        
        return driver

# Driver Serializer
class DriverSerializer(serializers.ModelSerializer):
    assigned_truck = TruckSerializer(read_only=True)  # Nesting Truck serializer

    class Meta:
        model = Driver
        fields = ['id', 'name', 'phone_number', 'email', "password", 'assigned_truck']
        extra_kwargs = {'password': {'write_only': True}} #hides passwword in response

    def create(self, validated_data):
        driver = Driver.objects.create(**validated_data)
        driver.set_password(validated_data['password'])  # Hash password
        driver.save()
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