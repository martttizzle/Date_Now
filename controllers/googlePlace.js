var googleMapsClient = require('@google/maps').createClient({
    // key: process.env.GOOGLE_KEY
    key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
});
var distance = require('google-distance-matrix');

module.exports = function (searchInput, mainCallback) {
    let results = [];
    for (i in searchInput) {
        let place = {
            popularity: searchInput[i].popularity,
        };
        googleMapsClient.place({
            placeid: searchInput[i].apiId
        }, function (err, response) {
            if (!err) {

                //Need zipcode, popularity, description,imageurl,type (restaurant, etc), apiType
                place.apiId = response.json.result.place_id;
                place.name = response.json.result.name;
                place.open = openNow(response.json.result.opening_hours);
                place.googleRating = response.json.result.rating;
                place.pricing = pricing(response.json.result);
                place.address = response.json.result.vicinity;
                place.coordinates = response.json.result.geometry.location.lat + ',' + response.json.result.geometry.location.lng;
                place.zipcode = searchInput[i].zipCode;
                results.push(place);
                if (results.length === searchInput.length) {

                    addRange(results, function (ranges) {
                        for (i in results) {
                            results[i].distance = ranges[i];
                        }
                        mainCallback(results);
                    });
                }
            }
            else if (err === 'timeout') {
                console.log("Timeout");
            }
            else {
                console.log(err.json);
            }
        });
    }
}

// Get distance range of places from location of client
let addRange = function (activity, addRangeCallback) {
    let range = [];

    for (var i = 0; i < activity.length; i++) {
        let origin = activity[i].zipcode;
        let destination = activity[i].coordinates;

        distance.mode('driving');
        distance.units("imperial");

        var origins = [origin];
        var destinations = [destination];
        distance.matrix(origins, destinations, function (err, distances) {

            let dist = distances.rows[0].elements[0].distance.text;
            range.push(dist);

            if (range.length === activity.length) {
                // This is the second level call back(mainCallback) for main module (Returns to main module with formatted data)
                addRangeCallback(range);
            }
        });
    }
}


// Helper functions for formatting data
function pricing(arg) {
    if (arg.price_level !== undefined) {
        return arg.price_level;
    } else {
        return arg.price_level = "No data";
    }
}

function openNow(arg) {
    if (arg !== undefined) {
        if (arg.open_now === true) {
            return arg.open_now = "Open"
        } else {
            return arg.open_now = "Closed"
        }

    } else {

        arg = { open_now: "No data" };
        return arg.open_now;
    }
}

