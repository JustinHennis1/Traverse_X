import pandas as pd
import requests
import time
import csv
from collections import defaultdict
api_key = 'INSERT YOUR API KEY'

# Get arguments from query to flask route
# State and City validation will be done in the front end. addCity route checks the csv file first for a match
# Pass them to script below

def get_lat_long(city, country, api_key):
    """Retrieve latitude and longitude for a city using the Google Geocoding API."""
    geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={city},{country}&key={api_key}"
    response = requests.get(geocode_url)
    if response.status_code == 200 and response.json()['results']:
        location = response.json()['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None

def get_nearby_pois_updated(latitude, longitude, api_key, types):
    """Retrieve Points of Interest near the specified latitude and longitude using the Google Places API."""
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    all_places = []
    for place_type in types:
        next_page_token = None
        while True:
            params = {
                'location': f"{latitude},{longitude}",
                'radius': '10000',
                'type': place_type,
                'key': api_key
            }
            if next_page_token:
                params['pagetoken'] = next_page_token
                time.sleep(2)  # Ensure compliance with API token pacing
            response = requests.get(url, params=params)
            if response.status_code == 200:
                results = response.json()
                all_places.extend(results.get('results', []))
                next_page_token = results.get('next_page_token')
                if not next_page_token:
                    break
            else:
                print(f"Failed to retrieve places for type {place_type}")
                break
    return all_places

def categorize_types(types):
    """Categorize place types based on predefined categories."""
    category_mapping = {
        'Food': ['restaurant', 'cafe', 'bar', 'bakery'],
        'Tourist Attraction': ['museum', 'aquarium', 'zoo', 'art_gallery','tourist_attraction'],
        'Park': ['park'],
        'Shopping': ['shopping_mall', 'clothing_store'],
        'Entertainment': ['movie_theater', 'amusement_park', 'night_club'],
        'Accommodation': ['lodging']
    }
    primary_category = 'Other'
    for category, category_types in category_mapping.items():
        if any(t in category_types for t in types):
            primary_category = category
            break
    return primary_category

def extract_place_details(place, api_key, city, state):
    """Extract detailed information from each place data retrieved from the Google Places API."""
    place_types = place.get('types', [])
    category = categorize_types(place_types)  # You can choose to keep or remove this line

    details = {
        'City': city,
        'State': state,
        'Name': place.get('name'),
        'Address': place.get('vicinity'),
        'Type': ', '.join(place.get('types', [])).replace('_', ' ').title(),
        'Food': int(any(t.lower() in ['restaurant', 'cafe', 'bar', 'bakery'] for t in place_types)),
        'Tourist Attraction': int(any(t.lower() in ['aquarium', 'zoo', 'art_gallery', 'tourist_attraction'] for t in place_types)),
        'Museum': int(any(t.lower() =='museum' for t in place_types)),
        'Park': int(any(t.lower() == 'park' for t in place_types)),
        'Shopping': int(any(t.lower() in ['shopping_mall', 'clothing_store'] for t in place_types)),
        'Entertainment': int(any(t.lower() in ['movie_theater', 'amusement_park', 'night_club'] for t in place_types)),
        'Accommodation': int(any(t.lower() == 'lodging' for t in place_types)),
        'Government': int(any(t.lower() in ['local_government_office', 'government'] for t in place_types)),
        # Add more categories as needed
        'Rating': place.get('rating', 'No rating'),
        'Total Ratings': place.get('user_ratings_total', 'No data'),
        'Status': place.get('business_status', 'No data'),
        'Latitude': place['geometry']['location']['lat'],
        'Longitude': place['geometry']['location']['lng'],
        'Open Now': int(place.get('opening_hours', {}).get('open_now', False)),
        'Price Level': place.get('price_level', 'No data'),
        'Website': place.get('website', 'No data'),
        'Local Phone': place.get('formatted_phone_number', 'No data'),
        'International Phone': place.get('international_phone_number', 'No data'),
        'Permanently Closed': int(place.get('permanently_closed', False)),
        'Place ID': place.get('place_id', 'No data'),
        'Viewport': place['geometry'].get('viewport', 'No data'),
        'Icon URL': place.get('icon', 'No data')
    }
    return details

def plan_my_day(city, state, country, api_key):
    """Plan the data gathering for each city."""
    lat, lng = get_lat_long(city, country, api_key)
    if lat is None or lng is None:
        return []
    types = ['tourist_attraction', 'restaurant', 'park', 'amusement_park', 'museum', 'movie_theater', 'aquarium', 'zoo', 'shopping_mall']
    places = get_nearby_pois_updated(lat, lng, api_key, types)
    detailed_places = [extract_place_details(place, api_key, city, state) for place in places]
    return detailed_places

def save_to_csv(data, filename):
    """Save collected data to CSV file."""
    if not data:
        return
    keys = data[0].keys()
    with open(filename, 'a', newline='', encoding='utf-8') as output_file:  # Open in append mode ('a')
        dict_writer = csv.DictWriter(output_file, keys)
        # If the file is empty, write header, otherwise skip writing the header
        if output_file.tell() == 0:
            dict_writer.writeheader()
        dict_writer.writerows(data)
    

def add_city_data(City, State):
    # Process and save data for each city
    all_city_data = []
    city_info = plan_my_day(City, State, 'USA', api_key)
    all_city_data.extend(city_info)

    save_to_csv(all_city_data, './justin/city_data.csv')
