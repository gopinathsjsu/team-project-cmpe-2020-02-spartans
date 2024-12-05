import requests
import os

# Get the Google API Key from environment variables
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Mapping of keywords to your CuisineType model names
CUISINE_TYPE_MAPPING = {
    'italian': 'Italian',
    'mexican': 'Mexican',
    'chinese': 'Chinese',
    'greek': 'Greek',
    'japanese': 'Japanese',
    # Add more mappings as needed
}

# Mapping of keywords to your FoodType model names
FOOD_TYPE_MAPPING = {
    'vegan': 'Vegan',
    'vegetarian': 'Vegetarian',
    'gluten-free': 'Gluten-free',
    # Add more mappings as needed
}

def fetch_google_places(zip_code):
    geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={zip_code}&key={GOOGLE_API_KEY}"
    geocode_response = requests.get(geocode_url)
    if geocode_response.status_code == 200:
        location_data = geocode_response.json().get('results')
        if location_data:
            location = location_data[0]['geometry']['location']
            lat, lng = location['lat'], location['lng']
            
            places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                'location': f"{lat},{lng}",
                'radius': 5000,  # Adjust the radius as needed
                'type': 'restaurant',
                'key': GOOGLE_API_KEY
            }
            places_response = requests.get(places_url, params=params)
            if places_response.status_code == 200:
                return places_response.json().get('results')
    return []

def normalize_google_place_result(place):
    price_level_mapping = {
        1: '$',
        2: '$$',
        3: '$$$',
    }

    # Extract Google Places types and name
    place_types = place.get('types', [])
    place_name = place.get('name', '').lower()

    # Infer cuisine type based on name or types
    inferred_cuisines = []
    for keyword, cuisine_name in CUISINE_TYPE_MAPPING.items():
        if keyword in place_name or any(keyword in place_type for place_type in place_types):
            inferred_cuisines.append(cuisine_name)

    # Infer food type based on name or types
    inferred_food_types = []
    for keyword, food_name in FOOD_TYPE_MAPPING.items():
        if keyword in place_name or any(keyword in place_type for place_type in place_types):
            inferred_food_types.append(food_name)

    return {
        'name': place.get('name', 'N/A'),
        'address': place.get('vicinity', 'N/A'),
        'latitude': place.get('geometry', {}).get('location', {}).get('lat'),
        'longitude': place.get('geometry', {}).get('location', {}).get('lng'),
        'rating': place.get('rating', 0.0),
        'place_id': place.get('place_id'),  # Store the Google Places ID for fetching more details later
        'cuisine_type': [],  
        'food_type': [],     
        'price_range': price_level_mapping.get(place.get('price_level'), 'N/A'),  
        'source': 'google'
    }

def fetch_google_place_details(place_id):
    details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={GOOGLE_API_KEY}"
    details_response = requests.get(details_url)
    if details_response.status_code == 200:
        result = details_response.json().get('result', {})
        return {
            'name': result.get('name', 'N/A'),
            'address': result.get('formatted_address', 'N/A'),
            'latitude': result.get('geometry', {}).get('location', {}).get('lat'),
            'longitude': result.get('geometry', {}).get('location', {}).get('lng'),
            'rating': result.get('rating', 'N/A'),
            'phone_number': result.get('formatted_phone_number', 'N/A'),
            'website': result.get('website', 'N/A'),
            'opening_hours': result.get('opening_hours', {}).get('weekday_text', []),
            'reviews': result.get('reviews', []),
            'source': 'google'
        }
    return {}
