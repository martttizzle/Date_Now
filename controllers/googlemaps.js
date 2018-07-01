//module.exports

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAwxgGytwAklPuzg-otfYCjb5CQr7xd6B0",
    authDomain: "dateproject-52f8a.firebaseapp.com",
    databaseURL: "https://dateproject-52f8a.firebaseio.com",
    projectId: "dateproject-52f8a",
    storageBucket: "",
    messagingSenderId: "253390969861"
  };

firebase.initializeApp(config);



let loc = function (searchInput,callback) {

   
    let places = [];
   

   


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

                    
                    
                    for (var i = 0; i < response.json.results.length; i++) {
              
                       // if(response.json.results[i].name.includes("otel")){
                           //console.log("Hotel")
                           //console.log(response.json.results[i].name)
                           //return;
                        //    i=i+1;
                       // } else {
                           
                        let place = {};
                        place.placeID = response.json.results[i].place_id;
                        place.placeNames = response.json.results[i].name;
                        place.openNow = response.json.results[i].opening_hours.open_now;
                        place.googleRating = response.json.results[i].rating;
                        place.priceLvl = response.json.results[i].price_level;
                        place.placeAdress = response.json.results[i].vicinity;
                        place.coordinates = response.json.results[i].geometry.location.lat + ',' + response.json.results[i].geometry.location.lng;
                        place.range=0;

                        places.push(place);
        
                            // if (places.length === response.json.results.length) {

                            //     console.log(places.length);
                                
                               
                                
                            // }
                        
                    // // console.log(response.json.results);
                    // callback(response.json.results);
             
        } 

        callback(places);
        // console.log(places)
        // console.log(places.length);
        // } while(i<response.json.results.length);
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


let addRange = function(searchInput,activity) {

    let range = [];

var zipCodes = require('zipcodes');
var coordinates = zipCodes.lookup(searchInput.zipcode);
var distance = require('google-distance-matrix');
   distance.googleMapsClient;

var origin = coordinates.latitude + ',' + coordinates.longitude;

for (var i=0; i<activity.length; i++) {

let destination = activity[i].coordinates;
//console.log(activity[i])

distance.mode('driving');
distance.units("imperial");

var origins = [origin];
var destinations = [destination];
       
distance.matrix(origins, destinations, function (err, distances) {

//console.log("yay")
range[i] = distances.rows[0].elements[0].distance.text;
console.log(range[i])
if(range.length===activity.length) {
    console.log(range.join(" "));
}


});

}



}

var newSearch = {
    zipcode:"55444",
    dateType:"restaurant",
    distance:5
}

loc (newSearch,function(response){

   addRange(newSearch,response);
   //console.log(response)
   

})











// let loc = function (zipCode, type, miles) {

//     var zipcodes = require('zipcodes');
//     var places = [];
//     var loc = zipcodes.lookup(zipCode);

//     var distance = require('google-distance-matrix');
//     distance.googleMapsClient;

//     var meters = miles * (1 / 0.00062137119223733);
//     var googleMapsClient = require('@google/maps').createClient({
//         // You need to create an env variable GOOGLE_KEY and put your google api key there
//         // key: process.env.GOOGLE_KEY
//         key:'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
//     });

//     googleMapsClient.geocode({
//         address: zipCode
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
//                         console.log(places);
//                     }
//                 });
//             }
//         });
//     });
// }