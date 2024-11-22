from django.contrib.auth.backends import ModelBackend
from .models import CustomUser

class EmailAuthBackend(ModelBackend):
    """
    Authenticate users using their email and password.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Use email for authentication
            user = CustomUser.objects.get(email=username)
            if user.check_password(password):
                return user
        except CustomUser.DoesNotExist:
            return None
