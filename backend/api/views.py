from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import viewsets # type: ignore
from api.utils.osm import get_route
import json
from .models import Truck, Driver, Trip
from .serializers import TruckSerializer, DriverSerializer, TripSerializer


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

# GET /api/trucks/active_trucks/ → Returns only active trucks.
# GET /api/drivers/{id}/assigned_truck/ → Shows the truck assigned to a driver.
# GET /api/trips/?status=completed → Filters trips by status.
# GET /api/trips/ongoing_trips/ → Fetches only ongoing trips.
# POST /api/trips/{id}/complete_trip/ → Marks a trip as completed.

class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer

    @action(detail=False, methods=['GET'])
    def active_trucks(self, request):
        """Returns only active trucks."""
        active_trucks = Truck.objects.filter(status="active")
        serializer = self.get_serializer(active_trucks, many=True)
        return Response(serializer.data)

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

    @action(detail=True, methods=['GET'])
    def assigned_truck(self, request, pk=None):
        """Fetch the truck assigned to a driver."""
        driver = self.get_object()
        if driver.assigned_truck:
            return Response(TruckSerializer(driver.assigned_truck).data)
        return Response({"message": "No truck assigned"}, status=404)

class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer

    def get_queryset(self):
        """Allow filtering trips by status (ongoing/completed)."""
        queryset = Trip.objects.all()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=False, methods=['GET'])
    def ongoing_trips(self, request):
        """Fetch only ongoing trips."""
        ongoing_trips = Trip.objects.filter(status="ongoing")
        serializer = self.get_serializer(ongoing_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def complete_trip(self, request, pk=None):
        """Mark a trip as completed."""
        trip = self.get_object()
        trip.status = "completed"
        trip.save()
        return Response({"message": f"Trip {trip.id} completed."})
