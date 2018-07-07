module.exports = {

    googleMapsClient : require('@google/maps').createClient({
        // key: process.env.GOOGLE_KEY
        key: 'AIzaSyDQp6FuCr1V1Mvg8NfSKdkkbz3Ik9zjiNI'
        //'AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA'
      }),

      pricing: function(arg) {
        if (arg.price_level !== undefined) {
            return arg.price_level;
        } else {
            return arg.price_level = "No data";
        }
    },

    openNow: function(arg) {
        if (arg !== undefined) {
            if (arg.open_now === true) {
                return arg.open_now = "Open"
            } else {
                return arg.open_now = "Closed"
            }
    
        } else {
    
            arg = { open_now: "No data" };
            return arg.open_now;
        }
    },

      getData: function (searchInput, getDataCallback) {
        //Converts the jquey selection from string to number (meters)
        const raidusMeters = parseInt(searchInput.distance);
        // Find Google Places
        this.googleMapsClient.places({
            query: searchInput.zipcode,
            radius: raidusMeters,
            type: searchInput.type
        }, function (err, response) {
            // console.log(response.json.results)
            if (!err) {
                let rawData = response.json.results;
                let formattedData = [];
                for (let i = 1; i < rawData.length - 1; i++) {
                    let place = {};
                    //Need zipcode, popularity, description,imageurl,type (restaurant, etc), apiType
                    place.apiId = rawData[i].place_id;
                    place.name = rawData[i].name;
                    place.open = this.openNow(rawData[i].opening_hours);
                    place.googleRating = rawData[i].rating;
                    place.pricing = this.pricing(rawData[i]);
                    place.address = rawData[i].vicinity;
                    place.coordinates = rawData[i].geometry.location.lat + ',' + rawData[i].geometry.location.lng;
                    place.zipcode = searchInput.zipcode;
                    formattedData.push(place);
                }
                // This is the first level call back(addRange) for main module (Returns to main module with formatted data)
                getDataCallback(formattedData, searchInput);
            }
            else if (err === 'timeout') {
                console.log("Timeout");
            }
            else {
                console.log(err.json);
            }
        });
    },
    
    
   addRange : function (searchInput, activity, addRangeCallback) {

    var distance = require('google-distance-matrix');

        let range = [];
        var origin = searchInput.zipcode;
    
        for (var i = 0; i < activity.length; i++) {
    
            let destination = activity[i].coordinates;
    
            distance.mode('driving');
            distance.units("imperial");
    
            var origins = [origin];
            var destinations = [destination];
            distance.matrix(origins, destinations, function (err, distances) {
    
                let dist = distances.rows[0].elements[0].distance.text;
                range.push(dist);
    
                if (range.length === activity.length) {
                    // This is the second level call back(mainCallback) for main module (Returns to main module with formatted data)
                    addRangeCallback(range);
                }
            });
        }
    }


}