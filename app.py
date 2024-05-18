import csv
from scripts.findNearby import nearby
from scripts.findNearbyPostalCodes import nearbyPostal
from scripts.postalCodeSearch import searchPostal
from scripts.addCity import add_city_data
from scripts.nearbySearchLatLong import getnearbylocals
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import Flask, send_file
import os

app = Flask(__name__)
CORS(app)

def parse_csv(city, state, keys):
    data = []

    with open('./zoo-test/11processed_cities_and_pois.csv', 'r', encoding='utf-8') as csvfile:
        csvreader = csv.reader(csvfile)
        headers = next(csvreader)  # Read the headers
        for row in csvreader:
            if row[0] == city and row[1] == state:
                establishments = [establishment.strip() for establishment in row[4].split(',')]
                
                for key in keys:
                    if key in establishments and row not in data and row[8] == "OPERATIONAL":
                        data.append(row)
    return headers, data

@app.route('/getdata', methods=['POST'])
def get_data():
    request_data = request.get_json()
    city = request_data.get('city')
    state = request_data.get('state')
    keys = request_data.get('keys')

    headers, data = parse_csv(city, state, keys)
    return jsonify({"headers": headers, "data": data})




@app.route('/findNearby', methods=['POST'])
# Example JSON
#{
#     "username":"<user>",
#     "lat":"12.345",
#     "lng":"-73.595470",
#     "featureCode!": "BLDG",      <----- Note '!' is to exclude feature
#     "radius":"30"
# }
async def run_findNearby():
    param =  request.get_json()  # Include first two at least:
    result =  nearby(params=param)  #  latitude, longitude, featureClass, featureCode, radius, maxRows
    return jsonify(result)




@app.route('/findNearbyPostal', methods=['POST'])
# Example JSON
#{
#     "postalcode":"11746",
#     "country":"US",
#     "radius":"20",
#     "username":"<user>"
# }
async def run_findNearbyPostal():
    param2 =  request.get_json()  # Include first two at least:
    result =  nearbyPostal(params=param2)  # postal, country, radius, maxRows
    return jsonify(result)

@app.route('/searchPostal', methods=['POST'])
# Example JSON //Postal Code or Placename required
# {
#     "postalcode":"11146", or "placename":"melville"
#     "country":"US",
#      "style":"LONG",
#      "maxRows":"10"
#     "username":"<user>"
# }
async def run_searchPostal():
    param3 =  request.get_json()  # Include first two at least:
    result =  searchPostal(params=param3)  # postal, country, radius, maxRows
    return jsonify(result)

@app.route('/add_City', methods=['POST'])
async def add_it():
    inputdict = request.get_json()
    city, state = inputdict['City'], inputdict['State']
    if(checkCSI(city, state) == False):
        add_city_data(city,state)
        return "Success City and State have been submitted"
    
    return "City and State already exist in CSV"

def checkCSI(city, state):
    file = './scripts/city_data.csv'#FINAL_processed_cities_and_pois.csv'

    with open(file, 'r', encoding='utf-8') as csvfile:
        csvreader = csv.reader(csvfile)
        headers = next(csvreader)  # Read the headers
        for row in csvreader:
            if row[0] == city and row[1] == state:
                return True
            continue
    return False

@app.route('/nearbySearch', methods=['POST'])
async def nearbysearch():
    injs = request.get_json()
    lat, lng = injs['Latitude'], injs['Longitude']
    getnearbylocals(lat, lng)
    return jsonify("Success your local info is added")

@app.route('/nearby.csv', methods=['GET'])
def serve_nearby_csv():
    nearby_csv_path = os.path.join(os.getcwd(), 'my-travel-app/public/nearby.csv')
    return send_file(nearby_csv_path, mimetype='text/csv', as_attachment=True)
    



if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
