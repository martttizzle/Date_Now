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

// // var zipcodes = require('zipcodes');
// module.exports = function (searchInput) {
//     console.log("runs really");
//     var places = [];
//     var loc = zipcodes.lookup(searchInput.zipCode);
//     var distance = require('google-distance-matrix');
//     distance.googleMapsClient;

//     var meters = searchInput.miles * (1 / 0.00062137119223733);
//     var type = searchInput.type;
//     var googleMapsClient = require('@google/maps').createClient({
//         // You need to create an env variable GOOGLE_KEY and put your google api key there
//         // key: process.env.GOOGLE_KEY
//         key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
//     });

//     googleMapsClient.geocode({
//         address: searchInput.zipCode
//     }, function (err, response) {
//         if (err) { throw err }

//         let location = response.json.results[0].geometry.location;
//         // Geocode an address.
//         googleMapsClient.placesNearby({
//             location: location,
//             radius: meters,
//             type: type
//         }, function (err, response) {
//             if (err) { throw err }

//             for (var i = 0; i < response.json.results.length; i++) {

//                 var place = {};
//                 place.placeID = response.json.results[i].place_id;
//                 place.placeNames = response.json.results[i].name;
//                 place.openNow = response.json.results[i].opening_hours.open_now;
//                 place.googleRating = response.json.results[i].rating;
//                 place.priceLvl = response.json.results[i].price_level;
//                 place.placeAdress = response.json.results[i].vicinity;

//                 var origin = loc.latitude + ',' + loc.longitude;
//                 var destination = response.json.results[i].geometry.location.lat + ',' + response.json.results[i].geometry.location.lng;

//                 distance.mode('driving');
//                 distance.units("imperial");

//                 var origins = [origin];
//                 var destinations = [destination];

//                 distance.matrix(origins, destinations, function (err, distances) {
//                     if (!err)
//                         //console.log(distances);
//                         place.placeDistance = distances.rows[0].elements[0].distance.text;
//                     // console.log(placeDistance[i])
//                     places.push(place);

//                     if (places.length === response.json.results.length) {
//                         cb(places);
//                     }
//                 });
//             }
//         });
//     });
// }
// // "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAY0U67E3KYLT8jrELDUbWW9cR3Vt205uzzpBFp4BhMwDszYWx24U6GyB76WihOCArfRUxavQ78-ah3qw-7pR-xghFKdLTHPTF2hxlSftFFy0-eBE5cSK9u1PZsLIci18VEhCgx-Yk88z-I2UtY913sSUBGhR3JVkhLS23wGnK-PjuFEV6A2MMPg&key=AIzaSyAqwUr61c2v1IB62ie5sJKPsvMWlMAmE0g"

// //"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+photot+"&key=AIzaSyAqwUr61c2v1IB62ie5sJKPsvMWlMAmE0g"