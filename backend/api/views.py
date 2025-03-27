from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from .utils.osm import get_route

@api_view(['POST'])
def calculate_route(request):
    data = request.data
    start = (data['start_lng'], data['start_lat'])  # Longitude, Latitude
    end = (data['end_lng'], data['end_lat'])

    route = get_route(start, end)

    if route:
        return Response({"route": route})
    else:
        return Response({"error": "Unable to fetch route"}, status=400)
    