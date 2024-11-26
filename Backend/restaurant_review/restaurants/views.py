from django.shortcuts import render
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RestaurantSerializer, RestaurantDetailSerializer
from .models import Restaurant

class RestaurantSearchView(APIView):
    def get(self, request):
        # Extract query parameters
        name = request.query_params.get('name', '').strip()
        cuisine_type = request.query_params.get('cuisine_type', '').strip()
        food_type = request.query_params.get('food_type', '').strip()
        price_range = request.query_params.get('price_range', '').strip()
        min_rating = request.query_params.get('min_rating', '')
        max_rating = request.query_params.get('max_rating', '')

        # Start with all restaurants
        queryset = Restaurant.objects.filter(verified=True)

        # Apply filters
        if name:
            queryset = queryset.filter(name__icontains=name)
        if cuisine_type:
            queryset = queryset.filter(cuisine_type__iexact=cuisine_type)
        if food_type:
            queryset = queryset.filter(food_type__iexact=food_type)
        if price_range:
            queryset = queryset.filter(price_range=price_range)
        if min_rating and max_rating:
            try:
                min_rating_value = float(min_rating)
                max_rating_value = float(max_rating)
                queryset = queryset.filter(rating__gte=min_rating_value, rating__lte=max_rating_value)
            except ValueError:
                return Response({"error": "Invalid rating range"}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize and return filtered results
        serializer = RestaurantSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RestaurantListView(ListAPIView):
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        queryset = Restaurant.objects.all()

        # Query Parameters
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        cuisine = self.request.query_params.get('cuisine', None)
        food_type = self.request.query_params.get('food_type', None)
        price_range = self.request.query_params.get('price_range', None)
        min_rating = self.request.query_params.get('min_rating', '')
        max_rating = self.request.query_params.get('max_rating', '')

        # Filters
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(cuisine_type__icontains=search))
        if category:
            queryset = queryset.filter(cuisine_type__icontains=category)
        if cuisine:
            queryset = queryset.filter(cuisine_type__icontains=cuisine)
        if food_type:
            queryset = queryset.filter(food_type__icontains=food_type)
        if price_range:
            queryset = queryset.filter(price_range__icontains=price_range)
        if min_rating and max_rating:
            try:
                min_rating_value = float(min_rating)
                max_rating_value = float(max_rating)
                queryset = queryset.filter(rating__gte=min_rating_value, rating__lte=max_rating_value)
            except ValueError:
                pass

        # Sort by recommendation (e.g., highest rating first)
        queryset = queryset.order_by('-rating')

        return queryset

class RestaurantDetailView(APIView):
    def get(self, request, *args, **kwargs):
        restaurant_id = kwargs.get('id')  # Extract the 'id' from kwargs
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)