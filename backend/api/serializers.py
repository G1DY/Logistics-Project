from rest_framework import serializers # type: ignore
from .models import Truck, Driver, Trip, DriverLog


# Truck Serializer
class TruckSerializer(serializers.ModelSerializer):
    driver_id = serializers.IntegerField(write_only=True, required=False)  # optional driver input
    from .serializers import DriverSerializer
    assigned_driver = DriverSerializer(read_only=True)

    class Meta:
        model = Truck
        fields = ['id', 'license_plate', 'model', 'capacity', 'status', 'driver_id']

    def create(self, validated_data):
        driver = None

        # Pop driver_id if it exists in validated_data
        driver_id = validated_data.pop("driver_id", None)

        # Try getting driver from authenticated user
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            driver = request.user
        elif driver_id:
            driver = Driver.objects.filter(id=driver_id).first()

        # Ensure driver exists
        if not driver:
            raise serializers.ValidationError("Driver could not be determined.")

        # Check if this driver already has a truck
        if Truck.objects.filter(assigned_driver=driver).exists():
            raise serializers.ValidationError("This driver is already assigned to a truck.")

        truck = Truck.objects.create(**validated_data, assigned_driver=driver)
        return truck


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