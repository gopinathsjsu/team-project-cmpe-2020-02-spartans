from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer

# Create your views here.
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can interact with reviews

    def perform_create(self, serializer):
        """
        Set the user automatically when a review is created.
        """
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Custom delete to prevent users from deleting other users' reviews.
        """
        review = self.get_object()
        if review.user != request.user:
            return Response({'detail': 'You do not have permission to delete this review.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
