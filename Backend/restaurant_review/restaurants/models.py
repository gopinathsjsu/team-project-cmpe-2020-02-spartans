from django.db import models
from accounts.models import CustomUser  # Import the CustomUser model to link owners

class Restaurant(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'owner'})
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    cuisine_type = models.CharField(max_length=100)
    food_type = models.CharField(max_length=100)
    price_range = models.CharField(max_length=50)
    hours_of_operation = models.CharField(max_length=100)
    website = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=15)
    verified = models.BooleanField(default=False)  # For admin approval

    def __str__(self):
        return self.name