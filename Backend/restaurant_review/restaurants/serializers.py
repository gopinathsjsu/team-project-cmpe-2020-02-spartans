from rest_framework import serializers

from django.conf import settings
from .models import Restaurant, RestaurantPhoto

class   RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        exclude = ['owner'] 

class RestaurantPhotoSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    high_res_url = serializers.SerializerMethodField()
    class Meta:
        model = RestaurantPhoto
        fields = ['id', 'thumbnail_url', 'uploaded_at','high_res_url']
    
    def get_thumbnail_url(self, obj):
        # return f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{obj.thumbnail_s3_key}"
        return f"http://localhost:9004/photos/{obj.thumbnail_s3_key}"
    
    def get_high_res_url(self,obj):
        return f"http://localhost:9004/photos/{obj.photo_key}"

class RestaurantDetailSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()
    photos = RestaurantPhotoSerializer(many=True, read_only=True)

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
    photos = RestaurantPhotoSerializer(many=True, read_only=True, source='photos')
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'address', 'city', 'state', 'zip_code', 'cuisine_type', 
            'food_type', 'price_range', 'hours_of_operation', 'website', 'phone_number', 
            'owner', 'photos'
        ]
        read_only_fields = ['id', 'owner','photos']  # Prevent manual updates to these fields

    def get_category_display(self, obj):
        # Translate the category choice to a human-readable value
        return dict(Restaurant.CATEGORY_CHOICES).get(obj.cuisine_type, obj.cuisine_type)

    def get_food_type_display(self, obj):
        # Translate the food type choice to a human-readable value
        return dict(Restaurant.FOOD_TYPE_CHOICES).get(obj.food_type, obj.food_type)

    def get_price_range_display(self, obj):
        # Translate the price range choice to a human-readable value
        return dict(Restaurant.PRICE_RANGE_CHOICES).get(obj.price_range, obj.price_range)


