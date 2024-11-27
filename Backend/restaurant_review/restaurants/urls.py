from django.urls import path
from .views import RestaurantSearchView, RestaurantListView, RestaurantDetailView, AddRestaurantListingView

urlpatterns = [
    path('search/', RestaurantSearchView.as_view(), name='restaurant_search'),  # For search functionality
    path('', RestaurantListView.as_view(), name='restaurant_list'),  # For listing all restaurants
    path('<int:id>/', RestaurantDetailView.as_view(), name='restaurant_detail'),
    path('add/', AddRestaurantListingView.as_view(), name='add-restaurant'),
]
