from django.urls import path
from .views import RestaurantSearchView, RestaurantListView

urlpatterns = [
    path('search/', RestaurantSearchView.as_view(), name='restaurant_search'),  # For search functionality
    path('', RestaurantListView.as_view(), name='restaurant_list'),  # For listing all restaurants
]
