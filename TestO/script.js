$(document).ready(function () {


    var rest = "restaurant";
    var pyrmont;
    var googleapiKey = "AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA";
    var locationURL;
    var map;
    

    $("button").click(function () {
        $("input:text").val();
        // var zip = $("#zip").val();
        locationURL = geocodeQueryBuild(zip);
        callgeocodeAPI(locationURL);
    });

// "https://maps.googleapis.com/maps/api/geocode/json?address=" + input + "&key=" + googleapiKey;

    function geocodeQueryBuild(input) {
        var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA" 
        return queryURL;
    };
// + googleapiKey;
    // This function calls the geocode API and gets lang & latt
    function callgeocodeAPI(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (gecodeoResp) {
            ilat = parseFloat(gecodeoResp.results[0].geometry.location.lat);
            ilng = parseFloat(gecodeoResp.results[0].geometry.location.lng);

            pyrmont = {
                lat: ilat,
                lng: ilng
            }
            console.log(gecodeoResp);
            init(); 
        });

    

    function init() {

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: pyrmont
        });

        var request = {
            location: pyrmont,
            radius: 5,
            query: [rest]
        };

        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback());

    }

    function callback(results, status) {
        
            
                console.log(results);

            }
        
     
};
})