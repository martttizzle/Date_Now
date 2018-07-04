
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

    //Send Address back to Index page
    callback(response.json.results);

  });

}