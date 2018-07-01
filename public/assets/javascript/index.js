
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {

    //When Get my Location Button is clicked, get user location, send to server and get simplified location response via google reverse geocode.
    $("#btn-location").on("click", function () {
        var latlng;

        //Get User Location via Browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords);
                var latlng = {
                    lat: parseFloat(position.coords.latitude),
                    lng: parseFloat(position.coords.longitude)
                };

                //Send latitude and longitude to browser
                $.ajax("/location", {
                    type: "POST",
                    data: latlng

                    //Input returned value to index page form
                }).then(
                    function (response) {
                        $("#user-location-input").val(response);
                    });
            });
        }
    });


    $("#search-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var newDateSearch = {
            zipcode: $("#user-location-input").val().trim(),
            dateType: $("#date-options-input").val().trim().toLowerCase(),
            distance: parseFloat($("#max-range-input").val().trim())
        };

        // Send the POST request.
        $.ajax("/results", {
            type: "POST",
            data: newDateSearch
        }).then(
            function () {
                window.location.href = "/results";
            });
    });

});
