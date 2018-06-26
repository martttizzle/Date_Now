
    // Make sure we wait to attach our handlers until the DOM is fully loaded.
    $(function () {

        $("#search-form").on("submit", function (event) {
            // Make sure to preventDefault on a submit event.
            event.preventDefault();

            var newDateSearch = {
                userLocation: $("#user-location-input").val().trim(),
                dateMethods: $("#date-options-input").val().trim(),
                maxRange: $("#max-range-input").val().trim()
            };

            console.log(newDateSearch);


            // Send the POST request.
            $.ajax("/api/???", {
                type: "POST",
                data: newDateSearch
            }).then(
                function () {
                    console.log("created new search");

                    //Normally there would be a page refresh at this point, but I think we actually want to route to the new page (the page with the restaurant options)
                }
            );
        });

    });
