# Create your models here.
from django.db import models
from accounts.models import CustomUser
from restaurants.models import Restaurant
class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  # Assuming ratings are out of 5
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.restaurant.name} - {self.rating}/5'
