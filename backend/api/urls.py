from django.urls import path
from .views import *
from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import (
    DriverViewSet, VehicleViewSet, LogEntryViewSet, 
    ShippingDocumentViewSet, ComplianceRecordViewSet, calculate_route
)

# Create a router for automatic URL handling
router = DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'log-entries', LogEntryViewSet)
router.register(r'shipping-documents', ShippingDocumentViewSet)
router.register(r'compliance-records', ComplianceRecordViewSet)

urlpatterns = [
    path('calculate-route/', calculate_route, name='calculate_route'),
    path('', include(router.urls)),  # Include all registered viewsets
]
