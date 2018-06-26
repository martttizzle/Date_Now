  // Make sure we wait to attach our handlers until the DOM is fully loaded.
  $(function () {


    $("#navigation-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        //This function will need to accomodate 1 to MANY potential activities- not just 2- probably will need a constructor.
        console.log($("#todo-item-1").attr('data-api-type'));


        var userSelections = {
            selection1:userSelection1,
            selection2:userSelection2
        };

        console.log(userSelections);


        // Send the POST request for the server to add the unique info from the user choices to the counter database .
        $.ajax("/api/???", {
            type: "POST",
            data: userSelections
        }).then(
            function () {
                console.log("things have been selected!");


                //WE NEED TO DIRECT PAGE TO GOOGLE MAPS USING VAR userSelections as input AT THIS POINT
               
            }
        );
    });

});