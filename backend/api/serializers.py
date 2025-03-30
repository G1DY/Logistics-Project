from rest_framework import serializers # type: ignore
from .models import Driver, Vehicle, LogEntry, ShippingDocument, ComplianceRecord

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class LogEntrySerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source="driver.name", read_only=True)
    vehicle_license = serializers.CharField(source="vehicle.license_plate", read_only=True)

    class Meta:
        model = LogEntry
        fields = '__all__'

class ShippingDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingDocument
        fields = '__all__'

class ComplianceRecordSerializer(serializers.ModelSerializer):
    is_compliant = serializers.SerializerMethodField()

    class Meta:
        model = ComplianceRecord
        fields = '__all__'

    def get_is_compliant(self, obj):
        return obj.total_hours_past_7_days <= 70  

class DriverSerializer(serializers.ModelSerializer):
    vehicles = VehicleSerializer(many=True, read_only=True, source='vehicle_set')
    logs = LogEntrySerializer(many=True, read_only=True, source='logentry_set')

    class Meta:
        model = Driver
        fields = '__all__'