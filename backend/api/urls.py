from django.urls import path
from .views import *

urlpatterns = [
    path('route/', calculate_route, name='calculate_route'),
]