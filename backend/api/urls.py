from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import calculate_route, TruckViewSet, DriverViewSet, TripViewSet

router = DefaultRouter()
router.register(r'trucks', TruckViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('calculate_route/', calculate_route, name='calculate_route'),
    path('', include(router.urls)),  # Include all registered viewsets
]
