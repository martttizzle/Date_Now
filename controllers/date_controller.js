// *********************************************************************************
// This file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
// var path = require("path");
var express = require("express");
var router = express.Router();
var Sequelize = require('sequelize');
// Requiring our models
var Datenow = require("../models").Datenow;
// Requiring googlemaps api
var locations = require("./googlemaps.js");

//Requiring the fuction that will use the user geocode coordinates 
var geocode = require("./geocode.js");

// Routes
// =============================================================
// index route loads index.hbs view
router.get("/", function (req, res) {
  res.render("index");
});

// POST route first get data from googleapi then a GET to check for popularity if it exist in database
router.post("/results", function (req, res) {
  // call to googlemaps API endpoint with a callback
  // Result is in "results"
  locations(req.body, function (results) {
    // Function get the data needed from the JSON object returned from google
    getPopularity(results, function (formattedData) {
      // for POST 
      res.end("results");
      renderResult(formattedData);
    });
  });
});

// Gets Popularity

function getPopularity(data, callback) {
  let updatedData = data;
  let input = [];
  // console.log("getpop: ", data);
  for (i in data) {
    input.push(data[i].apiId);
  }
  Datenow.findAll({ where: { apiId: input } }).then(function (dbDateNow) {
    console.log(data);
    console.log("sequelize: ", dbDateNow);

    for (i in data) {
      let idFound = dbDateNow.find(search => search.apiId === data[i].apiId);
      (idFound) ? updatedData[i].popularity = idFound.popularity : updatedData[i].popularity = 0;
      console.log(updatedData[i].popularity);
    }
    console.log(updatedData);
    callback(updatedData);

  });
}
// RESULT.HBS GET REQ Via Post Callback
function renderResult(results) {
  router.get("/results", function (req, res) {
    //If null value to results send back to index page for now...
    if (results.length > 0) {

      var hbsPlacesObject = {
        places: results
      };

      res.render("results", hbsPlacesObject);

    } else {
      console.log("No");
      res.render("index");
    }

  });
}

router.post("/go", function (req, res) {
  // UPSERT (i.e insert or update if already exist) a new row
  console.log(req.body);

  Datenow.upsert({
    name: req.body.name,
    zipCode: req.body.zipcode,
    apiType: req.body.apiType,
    apiId: req.body.apiId
  }).then(function (dbDateNow) {
    // Call back to update the newly upserted row
    Datenow.update({
      popularity: Sequelize.literal('popularity + 1')
    },
      {
        where:
        {
          apiId: req.body.apiId
        }
      })

    res.json(dbDateNow);

  });
});

// POST route for incrementing the popularity
router.post("/itinerary", function (req, res) {
  res.end("itinerary");
  renderItineraryCallback(req.body);
});


function renderItineraryCallback(results) {
  router.get("/itinerary", function (req, res) {
    //If null value to results send back to index page for now...
    var hbsItineraryObject = {
      itinerary: results
    };
    res.render("itinerary", hbsItineraryObject);
  });
};

router.post("/location", function (req, res) {

  //User Coordinates 
  var userCoordinates = req.body
  //Create address search string of user's latitude and longitude for Google Geocode
  geocode(userCoordinates, function (address) {

    res.send(address);

  })
});



module.exports = router;