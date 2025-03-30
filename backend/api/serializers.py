from rest_framework import serializers # type: ignore
from .models import Truck, Driver, Trip

class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = '__all__'  # Or specify the fields explicitly if needed

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    truck = TruckSerializer(read_only=True)  # Nested serialization
    driver = DriverSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'