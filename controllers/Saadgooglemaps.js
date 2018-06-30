
module.exports  = function (searchInput, callback) {

    var zipCodes = require('zipcodes');
    var places = [];
    var loc = zipCodes.lookup(searchInput.zipcode);

    var distance = require('google-distance-matrix');
    distance.googleMapsClient;

   
    var googleMapsClient = require('@google/maps').createClient({
        // You need to create an env variable GOOGLE_KEY and put your google api key there
        // key: process.env.GOOGLE_KEY
        key:'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
    });

    googleMapsClient.geocode({
        address: searchInput.zipcode
    }, function (err, response) {
        if (err) { throw err }

        let location = response.json.results[0].geometry.location;
        // Geocode an address.
        googleMapsClient.placesNearby({
            location: location,
            radius: searchInput.distance * (1 / 0.00062137119223733),
            type: searchInput.type
        }, function (err, response) {
            if (err) { throw err }
            for (var i = 0; i < response.json.results.length; i++) {

                var place = {};
                place.placeID = response.json.results[i].place_id;
                place.placeNames = response.json.results[i].name;
                place.openNow = response.json.results[i].opening_hours.open_now;
                place.googleRating = response.json.results[i].rating;
                place.priceLvl = response.json.results[i].price_level;
                place.placeAdress = response.json.results[i].vicinity;

                var origin = loc.latitude + ',' + loc.longitude;
                var destination = response.json.results[i].geometry.location.lat + ',' + response.json.results[i].geometry.location.lng;
                
                distance.mode('driving');
                distance.units("imperial");

                var origins = [origin];
                var destinations = [destination];

                distance.matrix(origins, destinations, function (err, distances) {
                    if (!err)
                        //console.log(distances);
                        place.placeDistance = distances.rows[0].elements[0].distance.text;
                    // console.log(placeDistance[i])
                    places.push(place);

                    if (places.length === response.json.results.length) {
                        callback(places);
                    }
                });
            }
        });
    });
}


