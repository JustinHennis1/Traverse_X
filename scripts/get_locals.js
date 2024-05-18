const fs = require('fs');
const csv = require('csv-parser');

// Define the path to your CSV file
const city = "New York City";
const state = "New York";
const filePath = 'city_data.csv';
let museum = [];
let food = [];
let ta = [];
let shop = [];
let entertainment = [];
let acc = [];

let types = ['Museum', 'Food', 'Entertainment', 'Accommodation', 'Tourist Attraction', 'Shopping'];

read_csv(city, state, 3.9, 3);

function read_csv(city, state, rating, pricelvl) {
   museum = [];
   food = [];
   ta = [];
   shop = [];
   entertainment = [];
   acc = [];
   govt = [];

    // Read the CSV file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {

            if (row['City'] === city && row['State'] === state && row['Rating'] >= rating && row['Price Level'] <= pricelvl) {
                for (let i = 0; i < types.length; i++) {
                    if (row[types[i]] === '1') { 
                        switch (types[i]) {
                            case 'Museum':
                                museum.push(row);
                                break;
                            case 'Food':
                                food.push(row);
                                break;
                            case 'Entertainment':
                                entertainment.push(row);
                                break;
                            case 'Accommodation':
                                acc.push(row);
                                break;
                            case 'Tourist Attraction':
                                ta.push(row);
                                break;
                            case 'Shopping':
                                shop.push(row);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');

            // Sort each array based on rating (descending) and price level (ascending)
            museum.sort((a, b) => b['Rating'] - a['Rating'] || a['Price Level'] - b['Price Level']);
            food.sort((a, b) => b['Rating'] - a['Rating'] || a['Price Level'] - b['Price Level']);
            ta.sort((a, b) => b['Rating'] - a['Rating'] || a['Price Level'] - b['Price Level']);
            shop.sort((a, b) => b['Rating'] - a['Rating'] || a['Price Level'] - b['Price Level']);
            entertainment.sort((a, b) => b['Rating'] - a['Rating'] || a['Price Level'] - b['Price Level']);
            acc.sort((a, b) => b['Rating'] - a['Rating'] || a['Price Level'] - b['Price Level']);

            console.log("museum of 0 is equal to: ", museum[0]);
            console.log("ta of 0 is equal to: ", ta[0]);
            console.log("shop of 0 is equal to: ", shop[0]);
            console.log("food of 0 is equal to: ", food[0]);
            console.log("acc of 0 is equal to: ", acc[0]);
            console.log("ent of 0 is equal to: ", entertainment[0]);
            
            console.log("How many museums? ", museum.length);
            console.log("How many tourist attractions? ", ta.length);
            console.log("How many shopping locations? ", shop.length);
            console.log("How many food locations? ", food.length);
            console.log("How many accommodations? ", acc.length);
            console.log("How many entertainment locations? ", entertainment.length);

            // Example Itinerary
            let itin = [];

            if (museum.length > 0) {
                itin.push(museum[0]);
            }
            if (ta.length > 0) {
                itin.push(ta[0]);
            }
            if (food.length > 0) {
                itin.push(food[0]);
            }
            if (acc.length > 0) {
                itin.push(acc[0]);
            }
            if (entertainment.length > 0) {
                itin.push(entertainment[0]);
            }

            console.log("itinerary 1 = ",itin);
        });
}
