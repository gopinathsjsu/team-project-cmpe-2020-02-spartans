import requests
import os

# Get the Google API Key from environment variables
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

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
    return {
        'name': place.get('name', 'N/A'),
        'address': place.get('vicinity', 'N/A'),
        'latitude': place.get('geometry', {}).get('location', {}).get('lat'),
        'longitude': place.get('geometry', {}).get('location', {}).get('lng'),
        'rating': place.get('rating', 0.0),
        'phone_number': 'N/A',  # Not available in Nearby Search
        'website': 'N/A',       # Not available in Nearby Search
        'price_range': '$',     # Can be adjusted or mapped from price level
        'source': 'google'
    }
