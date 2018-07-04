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

// Routes
// =============================================================
// index route loads index.hbs view
router.get("/", function (req, res) {
  res.render("index");
});

// POST route first get data from googleapi then a GET to check for popularity if it exist in database
// router.get("/results/:zip/:type/:distance", function (req, res) {
//   // call to googlemaps API endpoint with a callback
//   var searchInput = {
//     zipcode :req.params.zip,
//     dateType:req.params.type,
//     distance:req.params.distance   
//   };

//   googleClient(searchInput, function (placesResults) {
//     // Function gets google data and check for popularity in Database
//     getPopularity(placesResults, function (formattedData) {
//       hbsPlacesObject = {
//         places: formattedData
//       };
//       // console.log("hbsPlacesObject", hbsPlacesObject);
//       // Renders in Handlebars
//       res.render("results", hbsPlacesObject);
//     });
//   });
// });

router.get("/results", function (req, res) {
  // call to googlemaps API endpoint with a callback
  console.log(req.query)
  var searchInput = {
    zipcode :req.query.zipcode,
    dateType:req.query.activity,
    distance:req.query.range  
  };

  googleClient(searchInput, function (placesResults) {
    // Function gets google data and check for popularity in Database
    getPopularity(placesResults, function (formattedData) {
      hbsPlacesObject = {
        places: formattedData
      };
      // console.log("hbsPlacesObject", hbsPlacesObject);
      // Renders in Handlebars
      res.render("results", hbsPlacesObject);
    });
  });
});


// POST route for incrementing the popularity
router.get("/itinerary", function (req, res) {
  //console.log("req.body", req.query);
  //If null value to results send back to index page for now...
  let hbsItineraryObject = {
    itinerary: results
  };
  //console.log("my hbs: ", hbsItineraryObject);
  res.render("itinerary", hbsItineraryObject);
});


router.post("/location", function (req, res) {
  //User Coordinates 
  var userCoordinates = req.body
  //Create address search string of user's latitude and longitude for Google Geocode
  geocode(userCoordinates, function (address) {

    res.send(address);

  })
});

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