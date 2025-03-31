import json
from django.shortcuts import render
from rest_framework.decorators import api_view, action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import viewsets # type: ignore
from django.utils.timezone import now
from .models import Truck, Driver, Trip
from .serializers import TruckSerializer, DriverSerializer, TripSerializer
from api.utils.osm import get_route


@api_view(['POST'])
def calculate_route(request):
    try:
        if not request.body:
            return Response({"error": "Empty request body"}, status=400)

        data = json.loads(request.body.decode('utf-8'))
        required_keys = ["start_lng", "start_lat", "end_lng", "end_lat"]
        if not all(k in data for k in required_keys):
            return Response({"error": "Missing required parameters"}, status=400)

        start = (data['start_lng'], data['start_lat'])
        end = (data['end_lng'], data['end_lat'])
        
        route_info = get_route(start, end)
        if not route_info:
            return Response({"error": "Could not fetch route"}, status=500)
        print("🚀 Route Info:", json.dumps(route_info, indent=2))  # Debugging output
        
        return Response(route_info)
    
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        print("Exception occurred:", e)
        return Response({"error": str(e)}, status=500)


class TruckViewSet(viewsets.ModelViewSet):
    """Handles CRUD for Trucks."""
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer

    @action(detail=False, methods=['GET'])
    def active_trucks(self, request):
        """Returns only active trucks."""
        active_trucks = Truck.objects.filter(status="active")
        serializer = self.get_serializer(active_trucks, many=True)
        return Response(serializer.data)


class DriverViewSet(viewsets.ModelViewSet):
    """Handles CRUD for Drivers."""
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

    @action(detail=True, methods=['GET'])
    def assigned_truck(self, request, pk=None):
        """Fetch the truck assigned to a driver."""
        driver = self.get_object()
        if driver.assigned_truck:
            return Response(TruckSerializer(driver.assigned_truck).data)
        return Response({"error": "No truck assigned"}, status=404)


class TripViewSet(viewsets.ModelViewSet):
    """Handles CRUD for Trips."""
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def get_queryset(self):
        """Allow filtering trips by status (ongoing/completed)."""
        status = self.request.query_params.get('status')
        return Trip.objects.filter(status=status) if status else Trip.objects.all()

    @action(detail=False, methods=['GET'])
    def ongoing_trips(self, request):
        """Fetch only ongoing trips."""
        ongoing_trips = Trip.objects.filter(status="ongoing")
        serializer = self.get_serializer(ongoing_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def complete_trip(self, request, pk=None):
        """Mark a trip as completed and set the end_time."""
        trip = self.get_object()
        trip.status = "completed"
        trip.end_time = now()  # Set completion timestamp
        trip.save()
        return Response({"message": f"Trip {trip.id} completed.", "end_time": trip.end_time})