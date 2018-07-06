
$(function () {


    //Array to store user selection objects
    var userSelections = {};

    //Show the first card on page load
    $('div[data-card="0"][data-set="0"').removeClass("hidden");

    //Keep track of current card
    var cardTracker = 0;

    //Keep track of current set- this variable is used to keep track of a stack of cards- we only want to show one set at a time (i.e. restaurants) and when a restuarant is selected, we want to the restaurant cards, and show the next set of cards (activities, for example);

    var cardSet = 0;

    //Main Forward/Reverse Card Function

    function adder(operator) {

        switch (operator) {
            case "+":
                return cardTracker + 1;
                break;
            case "-":
                return cardTracker - 1;
                break;
            default:
                break;
        }
    }

    $(".switch").on('click', function () {

        //Find out whether we are adding or subtracting
        var operator = $(this).data("name");

        //Track the potential change in card order
        var potentialCard = adder(operator);

        var $currentCard = $('div[data-card=' + cardTracker + ']');

        var $nextCard = $('div[data-card=' + potentialCard + ']');

        if ($nextCard.length) {

            var direction = "";
            //Get direction of card flow (+ or -)
            if (operator == "+" ) {
                direction = "left";
            } else {
                direction = "right";
            }
            //Card EXISTS, So Hide Current Card, Show next or previous Card
            $currentCard.hide("slide", { direction: direction }, 300, function () {
                $nextCard.show("slide", { direction: direction }, 300, function () {

                });
            });

            cardTracker = potentialCard;
        }
    });

    //Item is Selected Event Handler
    $(".select").on('click', function () {

        //Store Attributes
        userSelections.name = $(this).data("name");
        userSelections.type = $(this).data("activity-type");
        userSelections.zipcode = $(this).data("zipcode");
        userSelections.apiType = $(this).data("api-type");
        userSelections.apiId = $(this).data("api-id");

        let url = "/itinerary/" + userSelections.type + "/" + userSelections.apiType + "/" + userSelections.zipcode + "/" + userSelections.apiId + "/" + userSelections.name;

        $.ajax(url, {
            type: "GET",
            data: userSelections
        }).then(
            function () {
                window.location.href = url;
            });
    });




});