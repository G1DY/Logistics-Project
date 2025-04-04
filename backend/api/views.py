import json
from api.utils.drivers_utils import check_cycle_hours, log_driver_hours
from rest_framework.decorators import api_view, action # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import viewsets # type: ignore
from django.utils.timezone import now
from django.utils import timezone
from .models import Truck, Driver, Trip
from .serializers import  TruckSerializer, DriverSerializer, TripSerializer
from api.utils.route_utils import get_route
from .models import DriverLog
from .serializers import DriverLogSerializer
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # type: ignore
from django.contrib.auth import get_user_model
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
import logging
from rest_framework import status, permissions # type: ignore
from rest_framework.permissions import AllowAny # type: ignore


class DriverLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Handles driver login and returns JWT token upon successful authentication.
        """
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        driver = authenticate(request, username=email, password=password)

        if driver is not None:
            # Login successful, return token
            from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
            refresh = RefreshToken.for_user(driver)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"error": "Invalid credentials"}, status=401)


#--------------route map------------#
@api_view(['POST'])
def calculate_route(request):
    try:
        if not request.body:
            return Response({"error": "Empty request body"}, status=400)

        data = request.data
        required_keys = ["start_lng", "start_lat", "end_lng", "end_lat", "driver_id", "truck_id"]
        if not all(k in data for k in required_keys):
            return Response({"error": "Missing required parameters"}, status=400)

        start = (data['start_lng'], data['start_lat'])
        end = (data['end_lng'], data['end_lat'])
        driver_id = data["driver_id"]
        truck_id = data["truck_id"]

        # 🚀 Check if driver can continue based on 70-hour rule
        if not check_cycle_hours(driver_id):
            return Response({"error": "You have exceeded the 70-hour limit for the past 8 days."}, status=400)

        # 🔄 Fetch route details
        route_info = get_route(start, end)
        if not route_info:
            print("🚨 get_route failed: No route info returned")
            return Response({"error": "Could not fetch route"}, status=500)

        # 🕒 Auto-fill timestamps
        pickup_time = timezone.now()
        dropoff_time, fueling_count, fuel_stop_locations = log_driver_hours(
            driver_id, route_info["duration"], pickup_time, route_info["distance"], route_info["route"]
        )

        # 🚨 Check for excessive fuel stops
        if fueling_count > 3:
            warning_message = f"Warning: This trip requires {fueling_count} fuel stops."
        else:
            warning_message = None

        # ✅ Store trip details
        trip = Trip.objects.create(
            truck_id=truck_id,
            driver_id=driver_id,
            pickup_location=f"{start}",
            dropoff_location=f"{end}",
            start_time=pickup_time,
            end_time=dropoff_time,
            status="ongoing"
        )
        print(f"Fetching logs for driver_id: {driver_id}")

        # 📝 Add timestamps, fuel stops, and warning to response
        route_info.update({
            "pickup_time": pickup_time.strftime("%Y-%m-%d %H:%M:%S"),
            "dropoff_time": dropoff_time.strftime("%Y-%m-%d %H:%M:%S"),
            "fueling_count": fueling_count,  # ⛽ Add fuel stops
            "fuel_stop_locations": fuel_stop_locations,  # Locations of fuel stops
            "warning": warning_message,  # Warning for excessive fuel stops
            "trip_id": trip.id
        })
        return Response(route_info)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        print("Exception occurred:", e)
        return Response({"error": f"An error occurred: {str(e)}"}, status=500)
#--------------driverLogs-----------------#
    
@api_view(['POST'])
def log_driver_activity(request):
    """
    Logs driver activity including stops, rest, fueling, and total driving hours.
    """
    driver_id = request.data.get("driver_id")
    
    # Check if the driver exists
    if not Driver.objects.filter(id=driver_id).exists():
        return Response({"error": "Driver not found"}, status=404)

    serializer = DriverLogSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Log saved successfully", "log": serializer.data}, status=201)
    
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_driver_activity(request, driver_id):
    """
    Fetches total driving hours in the last 8 days and last trip details.
    """
    driver = Driver.objects.filter(id=driver_id).first()
    if not driver:
        return Response({"error": "Driver not found"}, status=404)

    # Fetch total hours in last 8 days
    total_hours = check_cycle_hours(driver_id)  

    # Fetch the latest trip log for this driver
    last_log = DriverLog.objects.filter(driver_id=driver_id).order_by('-log_date').first()

    log_details = {
        "total_hours_last_8_days": total_hours,
        "last_trip": {
            "pickup_time": last_log.pickup_time.strftime("%Y-%m-%d %H:%M:%S") if last_log else "N/A",
            "dropoff_time": last_log.dropoff_time.strftime("%Y-%m-%d %H:%M:%S") if last_log else "N/A",
            "distance": last_log.distance_covered if last_log else 0,
            "fueling_count": last_log.fueling_count if last_log else 0,
            "fuel_stop_locations": last_log.fuel_stop_locations if last_log else [],
        } if last_log else "No previous trip"
    }
    return Response(log_details, status=200)

@api_view(['GET'])
def get_driver_logs(request, driver_id):
    """
    Fetches all logs for a given driver.
    """
    logs = DriverLog.objects.filter(driver_id=driver_id).order_by('-log_date')
    
    if not logs.exists():
        return Response({"error": "No logs found for this driver"}, status=404)

    serializer = DriverLogSerializer(logs, many=True)
    return Response(serializer.data, status=200)
#-------------------truck and Driver viewset-------------------#
class TruckViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    """Handles CRUD for Trucks."""
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer

    @action(detail=False, methods=['GET'])
    def active_trucks(self, request):
        """Returns only active trucks."""
        active_trucks = Truck.objects.filter(status="active")
        serializer = self.get_serializer(active_trucks, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """
        Assigns truck to a driver if 'driver_id' is provided in the request.
        """
        driver_id = self.request.data.get("driver_id")
        if driver_id:
            try:
                driver = Driver.objects.get(id=driver_id)
                serializer.save(assigned_driver=driver)
            except Driver.DoesNotExist:
                serializer.save()  # fallback if driver not found
        else:
            serializer.save()


class DriverViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    """Handles CRUD for Drivers."""
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    def create(self, request, *args, **kwargs):
        print("Raw request body:", request.body.decode("utf-8")) 
        print("Received data:", json.dumps(request.data, indent=2))  # Debugging
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Validation errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['GET'])
    def assigned_truck(self, request, pk=None):
        """Fetch the truck assigned to a driver."""
        driver = self.get_object()
        if driver.assigned_truck:
            return Response(TruckSerializer(driver.assigned_truck).data)
        return Response({"error": "No truck assigned"}, status=404)


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
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