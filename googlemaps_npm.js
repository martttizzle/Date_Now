require('dotenv').config();

var googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_KEY //You need an environment variable "GOOGLE_KEY" to save your apikey
});

// Geocode an address.
googleMapsClient.placesNearby({
    // address: '1600 Amphitheatre Parkway, Mountain View, CA'
    location: [44.989123, -93.25180999999999],
    radius: 100,
    type: 'restaurant'
}, function (err, response) {
    if (!err) {
        console.log(response.json.results);
    }
    else if (err === 'timeout'){
        console.log("Timeout");
    }
    else {
        console.log(err.json);
    }
});
