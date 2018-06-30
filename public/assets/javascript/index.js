
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
