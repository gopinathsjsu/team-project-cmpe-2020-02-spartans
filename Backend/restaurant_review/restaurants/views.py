from django.shortcuts import render, get_object_or_404
from django.db.models import Q, Count
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from .serializers import RestaurantSerializer, RestaurantDetailSerializer
from .models import Restaurant
from accounts.permissions import IsAdmin, IsBusinessOwner

# View for searching restaurants using search bar
class RestaurantSearchView(APIView):
    def get(self, request):
        name = request.query_params.get('name', '').strip()
        zip_code = request.query_params.get('zip_code', '').strip()
        cuisine_type = request.query_params.get('cuisine_type', '').strip()
        food_type = request.query_params.get('food_type', '').strip()
        price_range = request.query_params.get('price_range', '').strip()
        min_rating = request.query_params.get('min_rating', '')
        max_rating = request.query_params.get('max_rating', '')

        queryset = Restaurant.objects.filter(verified=True)

        if name:
            queryset = queryset.filter(name__icontains=name)
        if zip_code:
            queryset = queryset.filter(zip_code=zip_code)
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

        serializer = RestaurantSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# View for listing restaurants in DB
class RestaurantListView(ListAPIView):
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        queryset = Restaurant.objects.all()

        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        cuisine = self.request.query_params.get('cuisine', None)
        food_type = self.request.query_params.get('food_type', None)
        price_range = self.request.query_params.get('price_range', None)
        min_rating = self.request.query_params.get('min_rating', '')
        max_rating = self.request.query_params.get('max_rating', '')

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

        queryset = queryset.order_by('-rating')

        return queryset

# view for restaurant details page
class RestaurantDetailView(APIView):
    def get(self, request, *args, **kwargs):
        restaurant_id = kwargs.get('id')  
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
    def put(self, request, *args, **kwargs):
        restaurant_id = kwargs.get('id') 
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)

            if restaurant.owner != request.user:
                return Response({"error": "You are not authorized to edit this restaurant."}, status=status.HTTP_403_FORBIDDEN)

            serializer = RestaurantDetailSerializer(restaurant, data=request.data, partial=True)  # Use `partial=True` to allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

# view for duplicate listing        
class DuplicateListingsView(APIView):
    def get(self, request):
        duplicates = Restaurant.objects.values('name', 'address', 'city', 'state', 'zip_code') \
            .annotate(count=Count('id')) \
            .filter(count__gt=1)

        duplicate_listings = []
        for duplicate in duplicates:
            listings = Restaurant.objects.filter(
                name=duplicate['name'],
                address=duplicate['address'],
                city=duplicate['city'],
                state=duplicate['state'],
                zip_code=duplicate['zip_code']
            )
            duplicate_listings.extend(RestaurantSerializer(listings, many=True).data)

        return Response(duplicate_listings, status=status.HTTP_200_OK)
    
class DeleteDuplicateListingView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, id):
        # Debugging token and user
        print(f"Authorization Header: {request.headers.get('Authorization', 'None')}")
        print(f"Authenticated User: {request.user}")
        
        if not request.user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        restaurant = get_object_or_404(Restaurant, id=id)
        restaurant.delete()
        return Response({"message": f"Listing with ID {id} has been deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class AddListingView(APIView):
    permission_classes = [IsBusinessOwner]

    def post(self, request, *args, **kwargs):
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

