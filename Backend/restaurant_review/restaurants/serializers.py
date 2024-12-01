from rest_framework import serializers
from .models import Restaurant

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
    