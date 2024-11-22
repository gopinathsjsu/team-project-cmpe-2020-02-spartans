from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'cuisine_type', 'food_type', 'price_range', 
            'rating', 'address', 'latitude', 'longitude', 'zip_code'
        ]
