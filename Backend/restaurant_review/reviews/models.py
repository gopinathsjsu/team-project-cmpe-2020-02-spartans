from django.db import models
from accounts.models import CustomUser  
from restaurants.models import Restaurant  

class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reviews")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="reviews")
    comment = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1)  # Ratings between 1.0 and 5.0
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'restaurant')  # A user can review a restaurant only once
        ordering = ['-created_at']  # Latest reviews first

    def __str__(self):
        return f"Review by {self.user.username} for {self.restaurant.name} ({self.rating} stars)"
