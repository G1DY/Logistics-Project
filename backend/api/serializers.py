from rest_framework import serializers # type: ignore
from .models import Driver, Vehicle, LogEntry, ShippingDocument, ComplianceRecord

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'

class ShippingDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingDocument
        fields = '__all__'

class ComplianceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceRecord
        fields = '__all__'