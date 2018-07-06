var googleMapsClient = require('@google/maps').createClient({
    // key: process.env.GOOGLE_KEY
    key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
});
var distance = require('google-distance-matrix');

module.exports = function (searchInput, mainCallback) {
    // Goto findPlaces function (Not a callback)
    findPlaces(searchInput, function (data) {
        // First level callback 
        addRange(searchInput, data, function (ranges) {

            for (var i = 0; i < data.length; i++) {
                data[i].distance = ranges[i];
            }
            // Second Level callback (This goes out of this module to date_controller.js)
            mainCallback(data);
        });
    });
}

let findPlaces = function (searchInput, findPlacesCallback) {
    // Get coordinates if not available using zipcode provided
    if (searchInput.coordinates === "null") {
        // Geocode coordinates.
        googleMapsClient.geocode({
            address: searchInput.zipcode
        }, function (err, response) {
            if (!err) {
                searchInput.coordinates = response.json.results[0].geometry.location;
                // Get perform actual googleapi call
                getData(searchInput, function (data) {
                    // wait and then callback function runs (Check getData)
                    findPlacesCallback(data, searchInput);
                });
            }
        });
    }
    else {
        // Get perform actual googleapi call
        getData(searchInput, function (data) {
            // wait and then callback function runs (Check getData)
            findPlacesCallback(data, searchInput);
        });
    }
}
// Geocode an address.
let getData = function (searchInput, getDataCallback) {
    //Converts the jquey selection from string to number (meters)
    const raidusMeters = parseInt(searchInput.distance);
    // Find Google Places
    googleMapsClient.places({
        query: searchInput.zipcode,
        radius: raidusMeters,
        type: searchInput.type
    }, function (err, response) {
        // console.log(response.json.results)
        if (!err) {
            let rawData = response.json.results;
            let formattedData = [];
            for (let i = 1; i < rawData.length - 1; i++) {
                let place = {};
                //Need zipcode, popularity, description,imageurl,type (restaurant, etc), apiType
                place.apiId = rawData[i].place_id;
                place.name = rawData[i].name;
                place.open = openNow(rawData[i].opening_hours);
                place.googleRating = rawData[i].rating;
                place.pricing = pricing(rawData[i]);
                place.address = rawData[i].vicinity;
                place.coordinates = rawData[i].geometry.location.lat + ',' + rawData[i].geometry.location.lng;
                place.zipcode = searchInput.zipcode;
                formattedData.push(place);
            }
            // This is the first level call back(addRange) for main module (Returns to main module with formatted data)
            getDataCallback(formattedData, searchInput);
        }
        else if (err === 'timeout') {
            console.log("Timeout");
        }
        else {
            console.log(err.json);
        }
    });
}
// Get distance range of places from location of client
let addRange = function (searchInput, activity, addRangeCallback) {
    let range = [];
    var origin = searchInput.zipcode;

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


// for(var i = 0; i < length; i++){
//     var variable = variables[i];
//     (function(var){ //start wrapper code
//       otherVariable.doSomething(var, function(err){ //callback for when doSomething ends
//         do something else with var; //please note that i'm dealing with var here, not variable
//       }
//     })(variable);//passing in variable to var here
//   }


//   function callbackFor(v) {
//     return function(err) { /* something with v */ };
//   }
//   for(var i = 0; i < length; i++) {
//     var variable = variables[i];
//     otherVariable.doSomething(callbackFor(variable));
//   }