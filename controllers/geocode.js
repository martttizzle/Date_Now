
const util = require('util')

module.exports = function (userCoordinates, callback) {

  var googleMapsClient = require('@google/maps').createClient({
    // key: process.env.GOOGLE_KEY
    key: 'AIzaSyBLEObzTBgTqqTThVr5Zio67T_Hy4ACZls'
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