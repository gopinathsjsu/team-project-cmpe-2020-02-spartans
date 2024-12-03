from django.db import models
from django.conf import settings
from accounts.models import CustomUser  

class Restaurant(models.Model):
    CATEGORY_CHOICES = [
        ('fast_food', 'Fast Food'),
        ('fine_dining', 'Fine Dining'),
        ('cafe', 'Cafe'),
    ]
    FOOD_TYPE_CHOICES = [
        ('vegan', 'Vegan'),
        ('vegetarian', 'Vegetarian'),
        ('non_veg', 'Non-Vegetarian'),
    ]
    PRICE_RANGE_CHOICES = [
        ('$','Low'),
        ('$$','Moderate'),
        ('$$$', 'Expensive')
    ]
    
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'owner'})
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    cuisine_type = models.CharField(max_length=100)
    food_type = models.CharField(max_length=100)
    price_range = models.CharField(max_length=50, choices=PRICE_RANGE_CHOICES)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    hours_of_operation = models.CharField(max_length=100)
    website = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=15)
    verified = models.BooleanField(default=False)  
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    review_count = models.PositiveIntegerField(default=0)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="restaurants")

    def update_rating(self):
        reviews = self.reviews.all() 
        if reviews.exists():
            self.average_rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
        else:
            self.average_rating = None
        self.save()

    def __str__(self):
        return self.name

class RestaurantPhoto(models.Model):
    restaurant = models.ForeignKey(
        'Restaurant', 
        on_delete=models.CASCADE, 
        related_name='photos'
    )
    photo_key = models.CharField(max_length=255)  # Store the S3 object key
    thumbnail_s3_key = models.CharField(max_length=255, blank=True, null=True)  # Thumbnail
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.restaurant.name}: {self.photo_key}"