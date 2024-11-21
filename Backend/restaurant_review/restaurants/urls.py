from django.urls import path
from .views import RestaurantSearchView, RestaurantListView

urlpatterns = [
    path('search/', RestaurantSearchView.as_view(), name='restaurant_search'),
    path('restaurants/', RestaurantListView.as_view(), name='restaurant_list'),
]
