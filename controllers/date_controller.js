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
var googleClient = require("./googlemaps.js");

//Requiring the fuction that will use the user geocode coordinates 
var geocode = require("./geocode.js");
var googlePlaces = require("./googleplace.js");

// Routes
// =============================================================
// index route loads index.hbs view
router.get("/", function (req, res) {
  res.render("index");
});

// POST route first get data from googleapi then a GET to check for popularity if it exist in database
router.get("/results/:type/:distance/:zipcode/:coordinates", function (req, res) {
  // call to googlemaps API endpoint with a callback
  googleClient(req.params, function (placesResults) {
    // Function gets google data and check for popularity in Database
    // This is the googlemaps callback (check googlemaps.js module mainCallback)
    // console.log(placesResults)
    getPopularity(placesResults, function (formattedData) {
      hbsPlacesObject = {
        places: formattedData
      };
      // Renders in Handlebars
      res.render("results", hbsPlacesObject);
    });
  });
});

// POST route for incrementing the popularity
router.get("/itinerary/:type/:api/:zipcode/:apiId/:name", async function (req, res) {
  // console.log(req.params)
  let hbsItineraryObject = {
    itinerary: req.params
  };
  res.render("itinerary", hbsItineraryObject);
});


router.put("/location", function (req, res) {
  //User Coordinates 
  var userCoordinates = req.body
  //Create address search string of user's latitude and longitude for Google Geocode
  geocode(userCoordinates, function (address) {
    // console.log("get location: ",address);
    res.send(address);

  })
});

router.post("/go", function (req, res) {
  // UPSERT (i.e insert or update if already exist) a new row
  // console.log(req.body);

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

router.get("/popular/:zipcode/:type", function (req, res) {
  Datenow.findAll({
    where: {
      zipcode: req.params.zipcode,
      popularity: {
        gte: 1
      }
    }
  }).then(function (dbDateNow) {
    // console.log(dbDateNow);

    googlePlaces(dbDateNow, function (formattedData) {
      // console.log("something: ", data);
      hbsPopularObject = {
        places: formattedData
      };
      // Renders in Handlebars
      res.render("results", hbsPopularObject);
      // Render as json object
      // res.json(hbsPopularObject);
    })
  })
});

// Gets Popularity
function getPopularity(data, callback) {

  let updatedData = data;
  let input = [];
  for (i in data) {
    input.push(data[i].apiId);
  }
  Datenow.findAll({ where: { apiId: input } }).then(function (dbDateNow) {
    for (i in data) {
      let idFound = dbDateNow.find(search => search.apiId === data[i].apiId);
      (idFound) ? updatedData[i].popularity = idFound.popularity : updatedData[i].popularity = 0;
    }
    callback(updatedData);
  });
}

module.exports = router;