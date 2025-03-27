from django.urls import path
from .views import *

urlpatterns = [
    path('/', calculate_route, name='calculate_route'),
]