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

router.get("/itinerary", function (req, res) {
  res.render("itinerary");
});

// POST route first get data from googleapi then a GET to check for popularity if it exist in database
router.post("/results", function (req, res) {
  // let finalResults = [];
  // call to googlemaps API endpoint with a callback
  // Result is in "results"
  locations(req.body, function (results) {
    // Function get the data needed from the JSON object returned from google
    console.log("Location results", results[1]);
    let initialResults = getData(results);

    // Function gets the popularity of a date place from database and performs a checkPopularityCallBack
    getPopularity(initialResults, function (index, dbData) {
      (dbData === null) ? initialResults[index].popularity = 0 : initialResults[index].popularity = dbData.popularity;
    });
    // for POST 
    res.end("results");
    // Function that calls GET request to "/result"
    renderResultCallBack(initialResults);
  });
});

// Gets Popularity
function getPopularity(data, checkPopularityCallBack) {
  // Takes in the intial result as data 
  for (let i = 0; i < data.length; i++) {
    // Check for popularity 
    Datenow.findById(data.apiId).then(function (dbDateNow) {
      // Perform a callback
      checkPopularityCallBack(i, dbDateNow);
    });
  }
}

// RESULT.HBS GET REQ Via Post Callback
function renderResultCallBack(results) {
  router.get("/results", function (req, res) {
    console.log(results.length);

    //If null value to results send back to index page for now...
    if (results.length > 0) {

      var hbsPlacesObject = {
        places: results
      };


      console.log(hbsPlacesObject.places[1]);
      res.render("results",hbsPlacesObject);


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

// POST route for incrementing the popularity
router.post("/itinerary", function (req, res) {
  // console.log(req.body);
  // UPSERT (i.e insert or update if already exist) a new row
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

module.exports = router;