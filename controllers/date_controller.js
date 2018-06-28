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
var locations = require("./googlemaps.js")

// Routes
// =============================================================

// index route loads view.html
router.get("/", function (req, res) {
  res.render("index");
  userZipcode = req.body.userZipcode;
  dateOptions = req.body.dateOptions;
  maxRange = req.body.maxRange;

  locations(userZipcode, dateOptions, maxRange, function (places) {
    console.log(places);
  })
});


router.get("/itinerary", function (req, res) {
  res.render("itinerary");
});

router.get("/results", function (req, res) {
  res.render("results");
});

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