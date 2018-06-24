// function to build query URL and return
function geocodeQueryBuild(input) {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + input + "&key=" + googleapiKey;
    return queryURL;
};

// This function calls the geocode API and gets lang & latt
function callgeocodeAPI(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (gecodeoResp) {

        ilat = parseFloat(gecodeoResp.results[0].geometry.location.lat);
        ilng = parseFloat(gecodeoResp.results[0].geometry.location.lng);
        initMap();
        for (var i = 0; i < type.length; i++) {
            serviceReq(type[i]);
        };

    });
};
function initMap(lats, lngs, classType, name, address, rating, placeURL, placeimg, placecontact) {

    pyrmont = {
        lat: ilat,
        lng: ilng
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 11,
        mapTypeId: 'terrain'
    });

    if (typeof (lats) !== "undefined") {

        for (var i = 0; i < lats.length; i++) {
            let ltln = {
                lat: parseFloat(lats[i]),
                lng: parseFloat(lngs[i])
            }
