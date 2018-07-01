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
    let initialResults = getData(results);
    let finalResults = getPopularity(initialResults);

    // for POST 
    res.end("results");

    // Function that calls GET request to "/result"
    renderResult(finalResults);
  });
});

// Gets Popularity
function getPopularity(data) {
  let updatedData = data;
  let input = [];
  for (i in data) {
    input.push(data[i].apiId);
  }
  Datenow.findAll({ where: { apiId: input } }).then(function (dbDateNow) {
    for (i in data) {
      let idFound = dbDateNow.find(search => search.apiId === data[i].apiId);
      (idFound) ? data[i].popularity = idFound.popularity : data[i].popularity = 0;

    }
  });
  return updatedData
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

// Get useful data from the googleapi call
function getData(rawData) {
  let formattedData = [];

  for (let i = 1; i < rawData.length - 1; i++) {
    let place = {};
    //Need zipcode, popularity, description,imageurl,type (restaurant, etc), apiType
    place.apiId = rawData[i].place_id;
    place.name = rawData[i].name;
    place.open = rawData[i].opening_hours.open_now;
    place.googleRating = rawData[i].rating;
    place.pricing = rawData[i].price_level;
    place.address = rawData[i].vicinity;
    formattedData.push(place);
  }
  return formattedData;
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


module.exports = router;