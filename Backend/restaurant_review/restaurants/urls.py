from django.urls import path
from .views import RestaurantSearchView, RestaurantListView, RestaurantDetailView, AddRestaurantListingView
from reviews.views import GetReviewsView, SubmitReviewView
urlpatterns = [
    path('search/', RestaurantSearchView.as_view(), name='restaurant_search'),  # For search functionality
    path('', RestaurantListView.as_view(), name='restaurant_list'),  # For listing all restaurants
    path('<int:id>/', RestaurantDetailView.as_view(), name='restaurant_detail'),
    path('add/', AddRestaurantListingView.as_view(), name='add-restaurant'),
    path('<int:restaurant_id>/reviews/', GetReviewsView.as_view(), name='get-reviews'),
    path('<int:restaurant_id>/reviews/add/', SubmitReviewView.as_view(), name='submit-review'),
]
