from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('owner', 'Business Owner'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    # Additional fields for Business Owners
    business_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    contact = models.CharField(max_length=15, blank=True, null=True)

    # Use email as the unique identifier for authentication
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'  # Set email as the identifier
    REQUIRED_FIELDS = ['username']  # Keep username as a required field for compatibility

    def __str__(self):
        return f"{self.email} ({self.role})"
