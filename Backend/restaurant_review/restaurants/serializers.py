from rest_framework import serializers
from django.db.models import Avg, Count
from .models import Restaurant, CuisineType, FoodType
from reviews.models import Review

class RestaurantSerializer(serializers.ModelSerializer):
    cuisine_type = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=CuisineType.objects.all()
    )
    food_type = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=FoodType.objects.all()
    )
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'address', 'city', 'state', 'zip_code', 'price_range', 
            'rating', 'hours_of_operation', 'website', 'phone_number', 
            'cuisine_type', 'food_type', 'description', 'review_count', 'average_rating'
        ]
    def get_cuisine_type(self, obj):
        return [cuisine.name for cuisine in obj.cuisine_type.all()]

    def get_food_type(self, obj):
        return [food.name for food in obj.food_type.all()]
        
    def get_review_count(self, obj):
        return Review.objects.filter(restaurant=obj).count()

    def get_average_rating(self, obj):
        avg_rating = Review.objects.filter(restaurant=obj).aggregate(Avg('rating'))['rating__avg']
        return round(avg_rating, 1) if avg_rating else None

class RestaurantDetailSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            "name",
            "cuisine_type",
            "food_type",
            "price_range",
            "rating",
            "address",
            "city",
            "state",
            "zip_code",
            "hours_of_operation",
            "website",
            "phone_number",
            "latitude",
            "longitude",
            "reviews",
            "description",
        ]

    def get_reviews(self, obj):
        return [
            {
                "reviewer": review.user.username,
                "comment": review.review_text,
                "rating": review.rating,
            }
            for review in obj.reviews.all()
        ]
    