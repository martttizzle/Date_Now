const googleMapsClient = require("./googleClientKey.js");
const helperFunction = require('./helperFunctions.js');

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
                place.open = helperFunction.openNow(response.json.result.opening_hours);
                place.googleRating = response.json.result.rating;
                place.pricing = helperFunction.pricing(response.json.result);
                place.address = response.json.result.vicinity;
                place.coordinates = response.json.result.geometry.location.lat + ',' + response.json.result.geometry.location.lng;
                place.zipcode = searchInput[i].zipCode;
                results.push(place);
                // check if all poplarity info has been received 
                if (results.length === searchInput.length) {
                    // Get Distance range

                    helperFunction.addRange(results, function (ranges) {
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