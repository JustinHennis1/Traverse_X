import requests
import argparse


def nearbyPostal(params): 
    #print(pcode, maxRows, country)
    # URL to make the GET request to
    
    # Making the GET request
    response = requests.get('http://api.geonames.org/findNearbyPostalCodesJSON?', params=params)

    # Checking if the request was successful (status code 200)
    if response.status_code == 200:
        # Print the response content
        #print(response.text)
        json_response = response.json()
        return json_response
    else:
        print(f"Error: {response.status_code}")
        

def main(args):
    nearbyPostal(args.postal, args.country, args.radius, args.maxrows)

if __name__ == "__main__":
    # Create ArgumentParser object
    parser = argparse.ArgumentParser(description="Retieve postal code of nearby locals from input local. Returns Name, County, Lat, Long, and Distance in Km's")

    # arguments
    parser.add_argument("--postal", help="Postal Code.")
    parser.add_argument("--country", help="Country Code.")
    parser.add_argument("--radius", help="Radius. Limit of 30km with free service")
    parser.add_argument("--maxrows", help="Max # of rows")

    # Parse command-line arguments
    args = parser.parse_args()
    main(args)