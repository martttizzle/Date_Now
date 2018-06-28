// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
// var path = require("path");

var express = require("express");

var router = express.Router();

// Routes
// =============================================================


  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  router.get("/", function(req, res) {
    // res.sendFile(path.join(__dirname, "../public/blog.html"));
    res.render("index");
  });

  router.get("/itinerary", function(req, res) {
    // res.sendFile(path.join(__dirname, "../public/blog.html"));
    res.render("itinerary");
  });

  router.get("/results", function(req, res) {
    // res.sendFile(path.join(__dirname, "../public/blog.html"));
    res.render("swipe");
  });

module.exports = router;

