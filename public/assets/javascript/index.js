
    // Make sure we wait to attach our handlers until the DOM is fully loaded.
    $(function () {

        $("#search-form").on("submit", function (event) {
            // Make sure to preventDefault on a submit event.
            event.preventDefault();

            var newDateSearch = {
                userZipcode: $("#user-location-input").val().trim(),
                dateOptions: $("#date-options-input").val().trim(),
                maxRange: $("#max-range-input").val().trim()
            };

            console.log(newDateSearch);


            // Send the POST request.
            $.ajax("/", {
                type: "GET",
                data: newDateSearch
            }).then(
                 function () {
                  console.log("created new search");
                  window.location.href = "/results";
                  

                    //Normally there would be a page refresh at this point, but I think we actually want to route to the new page (the page with the restaurant options)
                
            
        });
    });

    });
