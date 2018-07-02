module.exports = function (searchInput, callback) {
    var googleMapsClient = require('@google/maps').createClient({
        // key: process.env.GOOGLE_KEY
        key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
    });

    // Geocode an address.
    googleMapsClient.geocode({
        address: searchInput.zipcode
    }, function (err, response) {
        if (!err) {
            let location = response.json.results[0].geometry.location;
            // Geocode an address.
            googleMapsClient.placesNearby({
                // address: '1600 Amphitheatre Parkway, Mountain View, CA'
                location: location,
                radius: searchInput.distance * (1 / 0.00062137119223733),
                type: searchInput.type
            }, function (err, response) {
                if (!err) {
                    // console.log(response.json.results);
                    callback(response.json.results);
                }
                else if (err === 'timeout') {
                    console.log("Timeout");
                }
                else {
                    console.log(err.json);
                }
            });
        }
        else if (err === 'timeout') {
            console.log("Timeout");
        }
        else {
            console.log(err.json);
        }
    });
}