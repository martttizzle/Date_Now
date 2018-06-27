require('dotenv').config();

module.exports = function (zipCode,type,miles) {

    var meters = miles*(1/0.00062137119223733);
    var googleMapsClient = require('@google/maps').createClient({
        // You need to create an env variable GOOGLE_KEY and put your google api key there
        key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
        //process.env.GOOGLE_KEY
        
    });

    googleMapsClient.geocode({
        address: zipCode
    }, function (err, response) {
        if (!err) {
            let location = response.json.results[0].geometry.location;
            // Geocode an address.
            googleMapsClient.placesNearby({
                location: location,
                radius: meters,
                type: type
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