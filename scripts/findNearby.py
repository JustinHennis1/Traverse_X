import requests
import argparse

def nearby(params):
    # Constructing query parameters

    # Making the GET request
    response = requests.get('http://api.geonames.org/findNearbyJSON?', params=params)

    # Checking if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the JSON response
        json_response = response.json()
        return json_response
        
    else:
        print(f"Error: {response.status_code}")

def main(args):
    nearby(args.latitude, args.longitude, args.featureClass, args.featureCode, args.radius, args.maxrows)

if __name__ == "__main__":
    # Create ArgumentParser object
    parser = argparse.ArgumentParser(description="Retrieve information about nearby locations based on input coordinates.")

    # arguments
    parser.add_argument("-lat", "--latitude", help="Latitude.")
    parser.add_argument("-lng", "--longitude", help="Longitude.")
    parser.add_argument("-fclass", "--featureClass", help="Feature Class.")
    parser.add_argument("-fcode", "--featureCode", action="append", help="Feature Code.")
    parser.add_argument("-r", "--radius", help="Radius in km. Limit of 30km with free service")
    parser.add_argument("-mr", "--maxrows", help="Max number of rows")

    # Parse command-line arguments
    args = parser.parse_args()
    main(args)
