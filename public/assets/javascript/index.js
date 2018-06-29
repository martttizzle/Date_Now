
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {

    $("#search-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var newDateSearch = {
            zipcode: $("#user-location-input").val().trim(),
            dateType: $("#date-options-input").val().trim().toLowerCase(),
            distance: parseFloat($("#max-range-input").val().trim())
        };
        if (!newDateSearch.zipcode) {
            return;
        }
        searchPlaces(newDateSearch);

        // Send the POST request.
    });

    function searchPlaces(searchData) {
        console.log(searchData);
        $.post("/results", searchData)
            .then(getPlaces);
    }

    function getPlaces() {
        $.get("/results", function (data) {
            console.log(data);
        });
    }
    // $.ajax("/", {
    //     type: "POST",
    //     data: newDateSearch
    // }).then(
    //     function (result) {
    //         $.ajax("/result", {
    //             type: "GET",
    //             data: newDateSearch
    //         })
    //         console.log("created new search");
    //         window.location.href("/results");


    //         //Normally there would be a page refresh at this point, but I think we actually want to route to the new page (the page with the restaurant options)   
    //     });
});
