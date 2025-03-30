from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter # type: ignore
from .views import TruckViewSet, DriverViewSet, TripViewSet

router = DefaultRouter()
router.register(r'trucks', TruckViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('calculate-route/', calculate_route, name='calculate_route'),
    path('', include(router.urls)),  # Include all registered viewsets
]
