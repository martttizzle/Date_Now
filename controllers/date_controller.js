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
let place = {}
// index route loads view.html
router.get("/", function (req, res) {
  res.render("index");
});


router.get("/itinerary", function (req, res) {
  res.render("itinerary");
});

// POST route to get popularity if it exist in database
router.post("/results", function (req, res) {
  locations(req.body, function (results) {
    // search.results = (results);
    // console.log(search.results);
    // Get result and perform a callback
    let compiledResults = getData(results);
    res.render("results");
    // Call back to do a GET request to "/result"
    renderResultCallBack(compiledResults);
  });
})

function renderResultCallBack(formattedResult) {
  router.get("/results", function (req, res) {
    res.render("results", formattedResult);
  });
}

function getData(rawData) {
  let formattedData = [];
  for (let i = 1; i < rawData.length - 1; i++) {
    let place = {};
    place.apiId = rawData[i].place_id;
    place.name = rawData[i].name;
    place.open = rawData[i].opening_hours.open_now;
    place.googleRating = rawData[i].rating;
    place.pricing = rawData[i].price_level;
    place.address = rawData[i].vicinity;
    formattedData.push(place);
  }
  console.log(formattedData);
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