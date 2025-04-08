from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import calculate_route, TruckViewSet, DriverViewSet, TripViewSet, log_driver_activity, get_driver_logs
from .views import DriverLoginView


router = DefaultRouter()
router.register(r'trucks', TruckViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all registered viewsets
    path('calculate_route/', calculate_route, name='calculate_route'),
    path('log/', log_driver_activity, name='log_driver_activity'),
    path('driver-logs/<int:driver_id>/', get_driver_logs, name='driver-logs'),
    path('login/', DriverLoginView.as_view(), name='driver-login'),
]
