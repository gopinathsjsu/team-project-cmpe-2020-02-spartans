from django.shortcuts import render, get_object_or_404
from django.db.models import Q, Count
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from .serializers import RestaurantSerializer, RestaurantDetailSerializer, RestaurantListingSerializer
from .models import Restaurant, RestaurantPhoto
from .utils import upload_to_s3, delete_s3_object, generate_thumbnail
from accounts.permissions import IsAdmin, IsBusinessOwner

class RestaurantSearchView(APIView):
    def get(self, request):
        # Extract query parameters
        name = request.query_params.get('name', '').strip()
        zip_code = request.query_params.get('zip_code', '').strip()
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
            serializer = RestaurantDetailSerializer(restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
    def put(self, request, *args, **kwargs):
        restaurant_id = kwargs.get('id')  # Extract the 'id' from kwargs
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)

            # Check if the logged-in user is the owner of the restaurant
            if restaurant.owner != request.user:
                return Response({"error": "You are not authorized to edit this restaurant."}, status=status.HTTP_403_FORBIDDEN)

            # Deserialize the data
            serializer = RestaurantDetailSerializer(restaurant, data=request.data, partial=True)  # Use `partial=True` to allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        
class DuplicateListingsView(APIView):
    def get(self, request):
        # Group restaurants by name, address, city, state, and zip_code
        duplicates = Restaurant.objects.values('name', 'address', 'city', 'state', 'zip_code') \
            .annotate(count=Count('id')) \
            .filter(count__gt=1)

        # Collect duplicate listings
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
            serializer.save(owner=request.user)  # Set the owner to the authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddRestaurantListingView(APIView):
    permission_classes = [IsBusinessOwner]

    def post(self, request):
        print(f"Authenticated User: {request.user}")  # Log the user
        print(f"Request Auth: {request.auth}")  # Log the token or authentication details

        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)

        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            restaurant = serializer.save(owner=request.user)
            photos = request.FILES.getlist('photos')  # Expecting multiple photos
            for photo in photos:
                photo_key = upload_to_s3(photo)
                thumbnail_file = generate_thumbnail(photo)
                thumbnail_key = "thumbnail/" + photo_key
                upload_to_s3(thumbnail_file, thumbnail_key)
                RestaurantPhoto.objects.create(restaurant=restaurant, photo_key=photo_key, thumbnail_s3_key = thumbnail_key)


            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class UpdateRestaurantListingView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            listing = Restaurant.objects.get(pk=pk, owner=request.user)
        except Restaurant.DoesNotExist:
            return Response({"error": "Listing not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        serializer = RestaurantListingSerializer(listing, data=request.data, partial=True)
        if serializer.is_valid():
            listing = serializer.save()
            photos = request.FILES.getlist('photos')
            for photo in photos:
                photo_key = upload_to_s3(photo)
                thumbnail_file = generate_thumbnail(photo)
                thumbnail_key = "thumbnail/" + photo_key
                upload_to_s3(thumbnail_file, thumbnail_key)
                RestaurantPhoto.objects.create(restaurant=listing, photo_key=photo_key, thumbnail_s3_key = thumbnail_key)


            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OwnerRestaurantListingsView(APIView):
    permission_classes = [IsBusinessOwner]

    def get(self, request):
        if request.user.role != 'owner':
            return Response({"error": "Only business owners can view listings."}, status=status.HTTP_403_FORBIDDEN)

        listings = Restaurant.objects.filter(owner=request.user)
        serializer = RestaurantListingSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeletePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, photo_id):
        """
        Deletes a specific photo for a restaurant from S3 and database.
        """
        try:
            # Fetch the photo record
            photo = RestaurantPhoto.objects.get(id=photo_id)

            # Check ownership: ensure the photo belongs to a restaurant owned by the user
            if photo.restaurant.owner != request.user:
                return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

            # Delete the photo from S3
            if delete_s3_object(photo.s3_key):
                # If S3 deletion is successful, delete the record from the database
                photo.delete()
                return Response({"message": "Photo deleted successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to delete photo from S3."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



        except RestaurantPhoto.DoesNotExist:
            return Response({"error": "Photo not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadPhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, restaurant_id):
        """
        Upload photos for a restaurant.
        """
        try:
            # Fetch the restaurant object to ensure the user owns it
            restaurant = Restaurant.objects.get(id=restaurant_id)

            if restaurant.owner != request.user:
                return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

            # Check if the file is in the request
            if 'photos' not in request.FILES:
                return Response({"error": "No photos provided."}, status=status.HTTP_400_BAD_REQUEST)

            photos = request.FILES.getlist('photos')
            for photo in photos:
                photo_key = upload_to_s3(photo)
                print("resetting buffer")
                thumbnail_file = generate_thumbnail(photo)
                thumbnail_key = "thumbnail/" + photo_key
                upload_to_s3(thumbnail_file, thumbnail_key)
                RestaurantPhoto.objects.create(restaurant=restaurant, photo_key=photo_key, thumbnail_s3_key = thumbnail_key)


            return Response({"message": "Photos uploaded successfully.", "status": "uploaded"}, status=status.HTTP_201_CREATED)

        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class PhotoDetailView(APIView):
    def get(self, request, photo_id):
        try:
            photo = RestaurantPhoto.objects.get(id=photo_id)
            full_resolution_url = f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{photo.s3_key}"
            return Response({"photo_url": full_resolution_url}, status=status.HTTP_200_OK)
        except RestaurantPhoto.DoesNotExist:
            return Response({"error": "Photo not found."}, status=status.HTTP_404_NOT_FOUND)