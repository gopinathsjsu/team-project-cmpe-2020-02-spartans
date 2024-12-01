from rest_framework import serializers
from .models import Restaurant, RestaurantPhoto

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        exclude = ['owner'] 


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
            "verified",
            "reviews",
            "photos",
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

class RestaurantListingSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')  # Display owner's username

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'address', 'city', 'state', 'zip_code', 'cuisine_type', 
            'food_type', 'price_range', 'hours_of_operation', 'website', 'phone_number', 
            'owner', 'photos'
        ]
        read_only_fields = ['id', 'owner']  # Prevent manual updates to these fields

    def get_category_display(self, obj):
        # Translate the category choice to a human-readable value
        return dict(Restaurant.CATEGORY_CHOICES).get(obj.cuisine_type, obj.cuisine_type)

    def get_food_type_display(self, obj):
        # Translate the food type choice to a human-readable value
        return dict(Restaurant.FOOD_TYPE_CHOICES).get(obj.food_type, obj.food_type)

    def get_price_range_display(self, obj):
        # Translate the price range choice to a human-readable value
        return dict(Restaurant.PRICE_RANGE_CHOICES).get(obj.price_range, obj.price_range)

class RestaurantPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantPhoto
        fields = ['id', 'photo_key', 'uploaded_at']

