
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {

    //Controlling nav/footer behavior on pageloads and depending on which page is loaded

    //Detect Index Page
    var url = window.location.href;

    if (url.indexOf("result") >= 0) {
        $("#snark-container").addClass("hidden");
        $("#footer").addClass("hidden");
    }

    if (url.indexOf("popular") >= 0) {
        $("#snark-container").addClass("hidden");
        $("#footer").addClass("hidden");
    }

    if (url.indexOf("itinerary") >= 0) {

    }

    //When Get my Location Button is clicked, get user location, send to server and get simplified location response via google reverse geocode.
    $("#btn-location").on("click", function () {

        //Get User Location via Browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latlng = {
                    lat: parseFloat(position.coords.latitude),
                    lng: parseFloat(position.coords.longitude)
                };

                //Send latitude and longitude to browser
                $.ajax("/location", {
                    type: "PUT",
                    data: latlng

                    //Input returned value to index page form
                }).then(
                    function (response) {
                        let address = 0;
                        // Check google json object for zipcode
                        for (let i = 0; i < response.length; i++) {
                            if (response[i].types[0] == 'postal_code') {
                                innerObject = response[i].address_components;
                                address = innerObject[0].long_name;
                                break;
                            }
                        }
                        // Add zipcode, coordinates, displayed address to dom,
                        $("#user-location-input").data("real-zipcode", address);
                        $("#user-location-input").data("location", response[1].geometry.location.lat.toString() + "," + response[1].geometry.location.lng.toString());
                        $("#user-location-input").val(response[1].formatted_address);
                    });
            });
        }
    });


    $("#search-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        let newDateSearch = getFormInformation();
        console.log(newDateSearch);
        let url = "/results/" + newDateSearch.dateType + "/" + newDateSearch.distance + "/" + newDateSearch.zipcode + "/" + newDateSearch.coordinates;

        // Send the GET request.
        console.log(url);
        $.ajax(url, {
            type: "GET",
            data: newDateSearch
        }).then(
            function () {
                $("#snark-container").slideUp();;
                $("#footer").slideToggle();
                window.location.href = url;
            });
    });

    // Get popular area button
    $("#popular-places").on("click", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        let popularDateSearch = getFormInformation();
        // console.log(popularDateSearch);
        // debugger;
        let url = "/popular/" + popularDateSearch.zipcode + "/" + popularDateSearch.dateType;
        // Send the GET request.
        // console.log(url);
        $.ajax(url, {
            type: "GET",
            data: popularDateSearch
        }).then(
            function () {
                $("#snark-container").slideUp();;
                $("#footer").slideToggle();
                window.location.href = url;
            });
        // Clear DOM element 
        $("#user-location-input").data("real-zipcode", "");
        $("#user-location-input").data("location", "");
        $("#user-location-input").val("");
    });

});


function getFormInformation() {
    let data = {
        coordinates: $("#user-location-input").data("location"),
        zipcode: $("#user-location-input").val().trim(),
        dateType: $("#date-options-input").val().trim().toLowerCase(),
        distance: parseFloat($("#max-range-input").val().trim())
    };
    //Two things happening 
    // 1. Check if user manually typed zipcode  thus no coordinates avaliable then SET COORDINATES to null for ajax request use 
    // 2. Check if user clicked get location and then SET ZIPCODE
    (data.coordinates !== "") ? data.zipcode = $("#user-location-input").data("real-zipcode") : data.coordinates = null;
    return data
}