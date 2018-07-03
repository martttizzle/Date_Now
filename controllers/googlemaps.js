let location = function (searchInput, callback) {

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
                type: searchInput.dateType
            }, function (err, response) {
                if (!err) {

                    callback(response.json.results)
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


let addRange = function (searchInput, activity, callback) {

    let range = [];

    var zipCodes = require('zipcodes');
    var coordinates = zipCodes.lookup(searchInput.zipcode);
    var distance = require('google-distance-matrix');
    distance.googleMapsClient;

    var origin = coordinates.latitude + ',' + coordinates.longitude;

    for (var i = 0; i < activity.length; i++) {

        let destination = activity[i].coordinates;

        distance.mode('driving');
        distance.units("imperial");

        var origins = [origin];
        var destinations = [destination];

        distance.matrix(origins, destinations, function (err, distances) {

            let dist = distances.rows[0].elements[0].distance.text;
            range.push(dist);

            if (range.length === activity.length) {

                callback(range);
            }

        });

    }

}


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

//Get useful data from the googleapi call
function getData(rawData) {
    let formattedData = [];

    for (let i = 1; i < rawData.length-1; i++) {
        let place = {};

        //Need zipcode, popularity, description,imageurl,type (restaurant, etc), apiType
        place.apiId = rawData[i].place_id;
        place.name = rawData[i].name;
        place.open = openNow(rawData[i].opening_hours);
        place.googleRating = rawData[i].rating;
        place.pricing = pricing(rawData[i]);
        place.address = rawData[i].vicinity;
        place.coordinates = rawData[i].geometry.location.lat + ',' + rawData[i].geometry.location.lng;

        formattedData.push(place);
    }
    return formattedData;
}




module.exports = function (searchInput, callback) {

    location(searchInput, function (response) {

        data = getData(response);

        addRange(searchInput, data, function (ranges) {

            for (var i = 0; i < data.length; i++) {
                data[i].distance = ranges[i];
            }
            
            callback(data);

        });



    });
}