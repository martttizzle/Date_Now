const googleMapsClient = require("./googleClientKey.js");
module.exports = function (userCoordinates, callback) {
var latLngString = (userCoordinates.lat).toString() + "," + (userCoordinates.lng).toString();

  // Reverse Geocode an address.
  googleMapsClient.geocode({
    address: latLngString
  }, function (err, response) {

    //Send Address back to Index page
    callback(response.json.results);

  });

}