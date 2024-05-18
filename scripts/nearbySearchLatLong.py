import pandas as pd
import requests
import time
import csv
import requests
from collections import defaultdict
api_key = 'INSERT API KEY'

def get_lat_long(city, country, api_key):
    geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={city},{country}&key={api_key}"
    response = requests.get(geocode_url)
    if response.status_code == 200 and response.json()['results']:
        location = response.json()['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None

def get_nearby_pois_updated(latitude, longitude, api_key, types):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    all_places = []
    for place_type in types:
        params = {
            'location': f"{latitude},{longitude}",
            'radius': '10000',
            'type': place_type,
            'key': api_key
        }
        while True:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                results = response.json()
                all_places.extend(results.get('results', []))
                next_page_token = results.get('next_page_token')
                if not next_page_token:
                    break
                params['pagetoken'] = next_page_token
                time.sleep(2)
            else:
                break
    return all_places

def categorize_place(place):
    categories = {
        'restaurant': 'Food', 'cafe': 'Food', 'museum': 'Tourist Attraction',
        'park': 'Tourist Attraction', 'shopping_mall': 'Shopping'
    }
    for ptype in place.get('types', []):
        if ptype in categories:
            return categories[ptype]
    return 'Other'

def filter_places(places):
    category_places = defaultdict(list)
    for place in places:
        category = categorize_place(place)
        if category != 'Other' and float(place.get('rating', 0)) >= 3.8:
            category_places[category].append(place)
    return category_places

def select_itinerary_places(category_places):
    itinerary = []
    for category, places in category_places.items():
        # Sort places by the number of ratings primarily, then by rating if tied
        sorted_places = sorted(places, key=lambda x: (-int(x.get('user_ratings_total', 0)), -float(x.get('rating', 0))))
        itinerary.extend(sorted_places[:10])  # Select top 4
    return itinerary

def save_to_csv(data, filename):
    keys = ['Index', 'City', 'State', 'Name', 'Address', 'Type', 'Rating', 'Total Ratings', 'Latitude', 'Longitude', 'Itinerary Category']
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        dict_writer = csv.DictWriter(file, fieldnames=keys)
        dict_writer.writeheader()
        for index, entry in enumerate(data, start=1):  # Start index from 1
            entry_with_index = {'Index': index, **entry}  # Add index to the entry
            dict_writer.writerow(entry_with_index)




def get_city_and_state_from_coords(latitude, longitude, api_key):
    """Retrieve the city and state name from latitude and longitude using Google Geocoding API."""
    url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={api_key}"
    response = requests.get(url)
    city, state = None, None  # Initialize city and state
    if response.status_code == 200:
        results = response.json().get('results', [])
        if results:
            address_components = results[0].get('address_components', [])
            for component in address_components:
                if 'locality' in component['types']:
                    city = component['long_name']
                elif 'administrative_area_level_1' in component['types']:
                    state = component['long_name']
                if city and state:  # Break loop if both city and state are found
                    break
    return city, state



def getnearbylocals(lat, lng):
   
    all_city_data = []       
    places = get_nearby_pois_updated(lat, lng, api_key, ['restaurant', 'cafe', 'museum', 'park', 'shopping_mall', 'tourist_attraction'])
    category_places = filter_places(places)
    itinerary_places = select_itinerary_places(category_places)
    city, state = get_city_and_state_from_coords(lat, lng, api_key)
    for place in itinerary_places:

        place_details = {
            'City': city,
            'State': state,
            'Name': place.get('name'),
            'Address': place.get('vicinity'),
            'Type': ', '.join(place.get('types', [])).replace('_', ' ').title(),
            'Rating': place.get('rating'),
            'Total Ratings': place.get('user_ratings_total'),
            'Latitude': place['geometry']['location']['lat'],
            'Longitude': place['geometry']['location']['lng'],
            'Itinerary Category': categorize_place(place)
        }
        all_city_data.append(place_details)

    save_to_csv(all_city_data, 'my-travel-app/public/nearby.csv')

# if __name__ == '__main__':
#     getnearbylocals(40.7896064,-73.3282304)

