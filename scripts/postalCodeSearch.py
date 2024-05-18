import requests
import xml.etree.ElementTree as ET
import argparse


def searchPostal(params):
    #print(pcode, maxRows, country)
    # URL to make the GET request to
    url = f'http://api.geonames.org/postalCodeSearchJSON?'
    print(url)
    # Making the GET request
    response = requests.get(url, params=params)

    # Checking if the request was successful (status code 200)
    if response.status_code == 200:
        # Print the response content
        #print(response.text)
        json_response = response.json()
        return json_response
    else:
        print(f"Error: {response.status_code}")

def main(args):
    searchPostal(args.postal, args.country, args.maxrows)

if __name__ == "__main__":
    # Create ArgumentParser object
    parser = argparse.ArgumentParser(description="Retieve postal code info: name, lat, long, state, county.")

    # arguments
    parser.add_argument("--postal", help="Postal Code.")
    parser.add_argument("--country", help="Country Code.")
    parser.add_argument("--maxrows", help="Maximum # of Rows.")

    # Parse command-line arguments
    args = parser.parse_args()
    main(args)