
module.exports = function(userCoordinates,callback) {

var googleMapsClient = require('@google/maps').createClient({
    // key: process.env.GOOGLE_KEY
    key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
  });

var latLngString = (userCoordinates.lat).toString() + "," + (userCoordinates.lng).toString();

// Reverse Geocode an address.
googleMapsClient.geocode({
  address: latLngString
}, function (err, response) {
  
  //Get Vague, but accurate address from Google API response
  var address = response.json.results[4].formatted_address;

  //Send Address back to Index page
  callback(address);
  
});

}