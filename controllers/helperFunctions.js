var distance = require('google-distance-matrix');
module.exports = {
    // Helper functions for formatting data
    pricing: function (arg) {
        if (arg.price_level !== undefined) {
            return arg.price_level;
        } else {
            return arg.price_level = "No data";
        }
    },

    openNow: function (arg) {
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

    // Get distance range of places from location of client
addRange : function (activity, addRangeCallback) {
        let range = [];

        for (var i = 0; i < activity.length; i++) {
            let origin = activity[i].zipcode;
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
