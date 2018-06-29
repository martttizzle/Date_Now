  // Make sure we wait to attach our handlers until the DOM is fully loaded.
  $(function () {


    $("#navigation-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        //This function will FOR NOW just grab info from the one restaurant activiity we have populated here, and then send it to the server before going to google maps 
        
        var todoItem = 1; 

        //Grabs all of the data from the page (this data isn't even really editable by the user. )
        var userItinerary = {
            name: $('#todo-item-'+todoItem).data("name"),
            activityType: $('#todo-item-'+todoItem).data("activity-type"),
            zipcode: $('#todo-item-'+todoItem).data("zipcode"),
            apiType: $('#todo-item-'+todoItem).data("api-type"),
            apiId: $('#todo-item-'+todoItem).data("api-id")
        }

        //Need place_id from googlemaps api. 
        if(event) {
        var plcId = "ChIJr8uaFhgts1IRc7Sj5UOUCeI";
        window.open("https://www.google.com/maps/search/?api=1&query=Google&query_place_id=" + plcId );
        console.log(userItinerary);
        }

        // Send the POST request for the server to add the unique info from the user choices to the counter database.
        $.ajax("/api/???", {
            type: "POST",
            data: userItinerary
        }).then(
            function () {
                console.log("things have been selected!");

                //WE NEED TO DIRECT PAGE TO GOOGLE MAPS USING VAR userSelections as input AT THIS POINT
               
            }
        );
    });

});