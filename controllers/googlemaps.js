require('dotenv').config();

module.exports = function () {
    var googleMapsClient = require('@google/maps').createClient({
        // You need to create an env variable GOOGLE_KEY and put your google api key there
        key: process.env.GOOGLE_KEY
    });

    googleMapsClient.geocode({
        address: '55414'
    }, function (err, response) {
        if (!err) {
            let location = response.json.results[0].geometry.location;
            // Geocode an address.
            googleMapsClient.placesNearby({
                location: location,
                radius: 1000,
                type: 'restaurant'
            }, function (err, response) {
                if (!err) {
                    // console.log(response.json.results);
                    return response.json.results;
                }
                else if (err === 'timeout') {
                    return "Timeout"
                }
                else {
                    return err.json;
                }
            });
        }
        else if (err === 'timeout') {
            return "Timeout";
        }
        else {
            return err.json;
        }
    });
}