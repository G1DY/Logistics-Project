from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from api.utils.osm import get_route	
import json

@api_view(['POST', 'GET'])
def calculate_route(request):
    try:
        print("Raw request body:", request.body)  # Debugging: Print raw request body
        
        if not request.body:
            return Response({"error": "Empty request body"}, status=400)

        data = json.loads(request.body.decode('utf-8'))  # Manually parse JSON

        print("Parsed request data:", data)  # Debugging: Print parsed JSON data

        if not all(k in data for k in ["start_lng", "start_lat", "end_lng", "end_lat"]):
            return Response({"error": "Missing required parameters"}, status=400)

        start = (data['start_lng'], data['start_lat'])
        end = (data['end_lng'], data['end_lat'])

        return Response({"message": "API is working!", "start": start, "end": end})

    except json.JSONDecodeError as e:
        return Response({"error": f"JSON decode error: {str(e)}"}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=400)