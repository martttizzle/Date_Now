module.exports = function (searchInput, callback) {
    var googleMapsClient = require('@google/maps').createClient({
        // key: process.env.GOOGLE_KEY
        key: 'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
    });

    /*** Places search work with zipcode, city, state or Locations button***/

    //convert meters string to a number
    const raidusMeters = parseInt(searchInput.distance);

    // Geocode an address.
    googleMapsClient.places({
        query: searchInput.zipcode,
        radius: raidusMeters,
        type: searchInput.dateType
    }, function (err, response) {
        if (!err) {
            // console.log(response.json.results);
            callback(response.json.results);
        } else if (err === 'timeout') {
            console.log("Timeout");
        } else {
            console.log(err.json);
        }
    });

}
