// Make sure we wait to attach our handlers until the DOM is fully loaded.


//JQUERY TO DO:

//1. Put google review into html data type and use jquery to turn this value into fontawesome stars in the cards. 
//2. Similar to #1, only populate 'popularity' when value is above 0... and if zero, say 'Be the first to check it out!'


$(function () {


    //Array to store user selection objects
    var userSelections = {};


    //Show the first card on page load
    $('div[data-card="1"][data-set="1"').removeClass("hidden");

    //Keep track of current card
    var cardTracker = 0;

    //Keep track of current set- this variable is used to keep track of a stack of cards- we only want to show one set at a time (i.e. restaurants) and when a restuarant is selected, we want to the restaurant cards, and show the next set of cards (activities, for example);

    var cardSet = 1;

    //Main Forward/Reverse Card Function

    var direction = "";

    function adder(operator) {

        switch (operator) {
            case "+":
                direction = "left";
                return cardTracker + 1;

                break;
            case "-":
                direction = "right";
                return cardTracker - 1;
                break;
            default:
                break;
        }
    }



    $(".switch").on('click', function () {
        var operator = $(this).data("name");


        var potentialCard = adder(operator);

        var $currentCard = $('div[data-card=' + cardTracker + ']');

        var $nextCard = $('div[data-card=' + potentialCard + ']');

        if ($nextCard.length) {
            console.log("EXISTS");

            //Card EXISTS, So Hide Current Card, Show next or previous Card

            $currentCard.hide("slide", { direction: direction }, 300, function () {
                $nextCard.show("slide", { direction: direction }, 300, function () {

                });
            });

            cardTracker = potentialCard;
        } else {

            //Card Does not exist so do nothing...  In the future, this could go back to the last card to create a loop
            console.log("DOESN'T EXIST");
        }

    });


    //THIS IS THE OLD SWITCH THAT USES MULTIPLE SETS OF CARDS- DO NOT DELETE

    // $(".switch").on('click', function () {
    //     var operator = $(this).data("name");

    //     var potentialCard = adder(operator);

    //     var $currentCard = $('div[data-card=' + cardTracker + '][data-set=' + cardSet + ']');

    //     var $nextCard = $('div[data-card=' + potentialCard + '][data-set=' + cardSet + ']');

    //     if ($nextCard.length) {
    //         console.log("EXISTS");

    //         //Card EXISTS, So Hide Current Card, Show next or previous Card
    //         $currentCard.hide();
    //         $nextCard.show();

    //         cardTracker = potentialCard;
    //     } else {

    //         //Card Does not exist so do nothing...  In the future, this could go back to the last card to create a loop
    //         console.log("DOESN'T EXIST");
    //     }

    // });


    //Item is Selected Event Handler
    $(".select").on('click', function () {

        //Store Attributes
        userSelections.name = $(this).data("name");
        userSelections.type = $(this).data("activity-type");
        userSelections.zipcode = $(this).data("zipcode");
        userSelections.apiType = $(this).data("api-type");
        userSelections.apiId = $(this).data("api-id");



        // var nextSet = parseInt(cardSet + 1);
        // var $nextCardSet = $('div[data-card=' + 1 + '][data-set=' + nextSet + ']');

        // console.log($nextCardSet);
        // //if there are no more card sets, Push data to server?
        // if ($nextCardSet.length) {
        //     console.log("NEXT SET EXISTS");
        //     //Hide current set
        //     $('div[data-set=' + cardSet + ']').hide();
        //     $nextCardSet.show();
        //     cardSet++;
        //     cardTracker = 1
        // } else {

        console.log("SUBMIT FORM????");
        console.log("SELECTED", userSelections);
        let url = "/itinerary/" + userSelections.type + "/" + userSelections.apiType + "/" + userSelections.zipcode + "/" + userSelections.apiId + "/" + userSelections.name;

        $.ajax(url, {
            //url: newDateSearch.zipcode,
            type: "GET",
            data: userSelections
        }).then(
            function () {
                window.location.href = url;
            });



        //if there are more card sets, hide all cards from current set, and increase card set and show 1st in next set.  
    });




});