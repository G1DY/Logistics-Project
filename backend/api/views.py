from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import viewsets # type: ignore
from api.utils.osm import get_route
import json
from .models import Driver, Vehicle, LogEntry, ShippingDocument, ComplianceRecord
from .serializers import (
    DriverSerializer, VehicleSerializer, LogEntrySerializer,
    ShippingDocumentSerializer, ComplianceRecordSerializer
)

@api_view(['POST'])
def calculate_route(request):
    try:
        print("Raw request body:", request.body)  # Debugging: Print raw request body
        
        if not request.body:
            return Response({"error": "Empty request body"}, status=400)

        data = json.loads(request.body.decode('utf-8'))  # Manually parse JSON

        print("Parsed request data:", data)  # Debugging: Print parsed JSON data

        if not all(k in data for k in ["start_lng", "start_lat", "end_lng", "end_lat"]):
            return Response({"error": "Missing required parameters"}, status=400)

        start = (data['start_lng'], data['start_lat'])
        end = (data['end_lng'], data['end_lat'])

        return Response({"message": "API is working!", "start": start, "end": end})

    except json.JSONDecodeError as e:
        return Response({"error": f"JSON decode error: {str(e)}"}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# ========================= API Views ==========================#

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer

    @action(detail=False, methods=['GET'])
    def driver_logs(self, request):
        driver_id = request.query_params.get('driver_id')
        logs = LogEntry.objects.filter(driver_id=driver_id)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)

class ShippingDocumentViewSet(viewsets.ModelViewSet):
    queryset = ShippingDocument.objects.all()
    serializer_class = ShippingDocumentSerializer

class ComplianceRecordViewSet(viewsets.ModelViewSet):
    queryset = ComplianceRecord.objects.all()
    serializer_class = ComplianceRecordSerializer