from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import LoginView, calculate_route, TruckViewSet, DriverViewSet, TripViewSet, log_driver_activity, get_driver_logs
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # type: ignore
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore
from .views import CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'trucks', TruckViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('calculate_route/', calculate_route, name='calculate_route'),
    path('', include(router.urls)),  # Include all registered viewsets
    path('log/', log_driver_activity, name='log_driver_activity'),
    path('driver-logs/<int:driver_id>/', get_driver_logs, name='driver-logs'),
    path('login/', LoginView.as_view(), name='login'),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
]
