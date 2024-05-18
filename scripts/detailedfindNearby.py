import requests
import xml.etree.ElementTree as ET
import argparse


def nearbydetails(lat,lng):
    arg1, arg2 = "",""
    
    if(lat):
        arg1 = f"lat={lat}"
    if(lng):
        arg2 = f"lng={lng}"
   
        
    #print(pcode, maxRows, country)
    # URL to make the GET request to
    url = f'http://api.geonames.org/findNearbyPostalCodes?{arg1}&{arg2}&username=<yourusernamehere>'
    print(url)
    # Making the GET request
    response = requests.get(url)

    # Checking if the request was successful (status code 200)
    if response.status_code == 200:
        # Print the response content
        print(response.text)
        xml_response = response.text
    else:
        print(f"Error: {response.status_code}")


    root = ET.fromstring(xml_response)

    # Extract relevant information
    #results_count = root.find('totalResultsCount').text
   # print("Total Results Count:", results_count)

    # Iterate over code elements
    for code_element in root.findall('code'):
        postalcode = code_element.find('postalcode').text
        name = code_element.find('name').text
        country_code = code_element.find('countryCode').text
        lat = code_element.find('lat').text
        lng = code_element.find('lng').text
        admincode1 = code_element.find('adminCode1').text
        adminname1 = code_element.find('adminName1').text
        distance = code_element.find('distance').text
        
        print("Postal Code:", postalcode)
        print("City/Town:", name)
        print("Country Code:", country_code)
        print("State/District:", admincode1, ",",adminname1)
        print("Latitude:", lat)
        print("Longitude:", lng)
        print("Distance:", distance,"Km")
        print()

def main(args):
    nearbydetails(args.latitude, args.longitude)

if __name__ == "__main__":
    # Create ArgumentParser object
    parser = argparse.ArgumentParser(description="Retieve postal code of nearby locals from input local. Returns Name, County, Lat, Long, and Distance in Km's")

    # arguments
    parser.add_argument("-lat","--latitude", help="Latitude.")
    parser.add_argument("-lng","--longitude", help="Longitude.")

    # Parse command-line arguments
    args = parser.parse_args()
    main(args)
