from rest_framework import serializers
from .models import Restaurant, CuisineType, FoodType

class RestaurantSerializer(serializers.ModelSerializer):
    cuisine_type = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=CuisineType.objects.all()
    )
    food_type = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=FoodType.objects.all()
    )
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'address', 'city', 'state', 'zip_code', 'price_range', 
            'rating', 'hours_of_operation', 'website', 'phone_number', 
            'cuisine_type', 'food_type'
        ]
    def get_cuisine_type(self, obj):
        return [cuisine.name for cuisine in obj.cuisine_type.all()]

    def get_food_type(self, obj):
        return [food.name for food in obj.food_type.all()]

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
        ]

    def get_reviews(self, obj):
        return [
            {
                "reviewer": review.user.username,
                "comment": review.comment,
                "rating": review.rating,
            }
            for review in obj.review_set.all()
        ]
    