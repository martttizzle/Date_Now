const googleMapsClient = require("./googleClientKey.js");
const helperFunction = require('./helperFunctions.js');

module.exports = function (searchInput, mainCallback) {
    // Goto findPlaces function (Not a callback)
    findPlaces(searchInput, function (data) {
        // First level callback 
        // console.log(data);
        helperFunction.addRange(data, function (ranges) {

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
    // Find Google Places
    googleMapsClient.placesNearby({
        location: searchInput.coordinates,
        radius: searchInput.distance * (1 / 0.00062137119223733),
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
                place.open = helperFunction.openNow(rawData[i].opening_hours);
                place.googleRating = rawData[i].rating;
                place.pricing = helperFunction.pricing(rawData[i]);
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
