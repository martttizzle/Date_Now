
const util = require('util')

module.exports = function (userCoordinates, callback) {

  var googleMapsClient = require('@google/maps').createClient({
    // key: process.env.GOOGLE_KEY
    key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
  });

  var latLngString = (userCoordinates.lat).toString() + "," + (userCoordinates.lng).toString();

  // Reverse Geocode an address.
  googleMapsClient.geocode({
    address: latLngString
  }, function (err, response) {

    //console.log(util.inspect(response.json.results, false, null))
    var address = 0;

    for (var i = 0; i < response.json.results.length; i++) {
      if (response.json.results[i].types[0] == 'postal_code') {
        console.log(response.json.results[i].short_name);
        innerObject = response.json.results[i].address_components;
        address = innerObject[0].long_name;
      }
    }

    //Send Address back to Index page
    callback(address);

  });

}