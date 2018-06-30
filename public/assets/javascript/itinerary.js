// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {


    $("#navigation-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        //This function will FOR NOW just grab info from the one restaurant activiity we have populated here, and then send it to the server before going to google maps 

        //Grabs all of the data from the page (this data isn't even really editable by the user. )
        var userItinerary = {
            name: $('#todo-item-1').data("name"),
            activityType: $('#todo-item-1').data("activity-type"),
            zipcode: $('#todo-item-1').data("zipcode"),
            apiType: $('#todo-item-1').data("api-type"),
            apiId: $('#todo-item-1').data("api-id")
        };


        //Need place_id from googlemaps api. 
        // if(event) {
        // // var plcId = "ChIJr8uaFhgts1IRc7Sj5UOUCeI";s
        // var plcId = userItinerary.apiId;
        // window.open("https://www.google.com/maps/search/?api=1&query=Google&query_place_id=" + plcId );
        // console.log(userItinerary);
      //  }

        // Send the POST request for the server to add the unique info from the user choices to the counter database.
        $.ajax("/go", {
            type: "POST",
            data: userItinerary
        }).then(
            function (response) {
                console.log(response,  "things have been selected!");

                //WE NEED TO DIRECT PAGE TO GOOGLE MAPS USING VAR userSelections as input AT THIS POINT

            }
        );
    });

});