from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Restaurant

class RestaurantSearchView(APIView):
    def get(self, request):
        # Extract query parameters
        name = request.query_params.get('name', '').strip()
        cuisine_type = request.query_params.get('cuisine_type', '').strip()
        food_type = request.query_params.get('food_type', '').strip()
        price_range = request.query_params.get('price_range', '').strip()
        city = request.query_params.get('city', '').strip()
        min_star = request.query_params.get('min_star', None)

        # Start with all restaurants
        restaurants = Restaurant.objects.filter(verified=True)

        # Apply filters
        if name:
            restaurants = restaurants.filter(name__icontains=name)
        if cuisine_type:
            restaurants = restaurants.filter(cuisine_type__iexact=cuisine_type)
        if food_type:
            restaurants = restaurants.filter(food_type__iexact=food_type)
        if price_range:
            restaurants = restaurants.filter(price_range=price_range)
        if city:
            restaurants = restaurants.filter(city__iexact=city)

        # Sort results by relevance (e.g., highest rating first)
        restaurants = restaurants.order_by('-verified')

        # Serialize response
        results = [
            {
                "name": restaurant.name,
                "address": restaurant.address,
                "city": restaurant.city,
                "state": restaurant.state,
                "zip_code": restaurant.zip_code,
                "cuisine_type": restaurant.cuisine_type,
                "food_type": restaurant.food_type,
                "price_range": restaurant.price_range,
                "hours_of_operation": restaurant.hours_of_operation,
                "website": restaurant.website,
                "phone_number": restaurant.phone_number,
                "verified": restaurant.verified,
            }
            for restaurant in restaurants
        ]

        return Response(results, status=status.HTTP_200_OK)
