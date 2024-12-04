from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Q, Count
from django.db.models.functions import Lower, Trim
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RestaurantSerializer, RestaurantDetailSerializer
from .models import Restaurant, CuisineType, FoodType
from accounts.permissions import IsAdmin, IsBusinessOwner

# View for searching restaurants using search bar
class RestaurantSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '').strip()
        zip_code = request.query_params.get('zip_code', '').strip()
        cuisine_type = request.query_params.get('cuisine_type', '').strip()
        food_type = request.query_params.get('food_type', '').strip()
        price_range = request.query_params.get('price_range', '').strip()
        min_rating = request.query_params.get('min_rating', '')
        max_rating = request.query_params.get('max_rating', '')

        queryset = Restaurant.objects.filter()

        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(cuisine_type__name__icontains=query) |
                Q(food_type__name__icontains=query)
            ).distinct()
        if zip_code:
            queryset = queryset.filter(zip_code=zip_code)
        if cuisine_type:
            cuisine_type_ids = [int(c) for c in cuisine_type.split(",")]
            queryset = queryset.filter(cuisine_type__id__in=cuisine_type_ids).distinct()
        if food_type and any(food_type):
            food_type_ids = [int(c) for c in food_type.split(",")]
            queryset = queryset.filter(food_type__id__in=food_type_ids).distinct()
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
        duplicates = Restaurant.objects.annotate(
            normalized_name=Lower(Trim('name')),
            normalized_address=Lower(Trim('address')),
            normalized_city=Lower(Trim('city')),
            normalized_state=Lower(Trim('state')),
            normalized_zip_code=Lower(Trim('zip_code'))
        ).values(
            'normalized_name', 'normalized_address', 'normalized_city', 'normalized_state', 'normalized_zip_code'
        ).annotate(count=Count('id')).filter(count__gt=1)

        duplicate_listings = []
        for duplicate in duplicates:
            listings = Restaurant.objects.filter(
                name__iexact=duplicate['normalized_name'],
                address__iexact=duplicate['normalized_address'],
                city__iexact=duplicate['normalized_city'],
                state__iexact=duplicate['normalized_state'],
                zip_code__iexact=duplicate['normalized_zip_code']
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
        cuisine_type_input = request.data.get('cuisine_type', [])
        food_type_input = request.data.get('food_type', [])

        try:
            # convert id of cuisine type to name
            if isinstance(cuisine_type_input[0], int):
                cuisine_names = list(CuisineType.objects.filter(id__in=cuisine_type_input).values_list('name', flat=True))
            else:
                cuisine_names = cuisine_type_input
            # convert id of food type to name
            if isinstance(food_type_input[0], int):
                food_names = list(FoodType.objects.filter(id__in=food_type_input).values_list('name', flat=True))
            else:
                food_names = food_type_input
        except Exception as e:
            return Response({"error": f"Error processing cuisine_type or food_type: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        request.data['cuisine_type'] = cuisine_names
        request.data['food_type'] = food_names

        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            restaurant = serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # error debugging
        print("Validation Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OldListingsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        print(f"Authenticated User: {request.user}")  # Log the user
        print(f"User Role: {request.user.role}") 
        print(f"Authorization Header: {request.headers.get('Authorization', 'None')}")
        if not request.user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # cutoff is at six months
        six_months_ago = now() - timedelta(days=180)

        # Query for listings with no reviews and created over 6 months ago
        old_listings = Restaurant.objects.filter(
            review_count=0,
            created_at__lt=six_months_ago
        )

        serializer = RestaurantSerializer(old_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        try:
            listing = Restaurant.objects.get(id=id, review_count=0, created_at__lt=now() - timedelta(days=180))
            listing.delete()
            return Response({"message": f"Listing with ID {id} has been deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Restaurant.DoesNotExist:
            return Response({"error": "Listing not found or does not meet deletion criteria."}, status=status.HTTP_404_NOT_FOUND)