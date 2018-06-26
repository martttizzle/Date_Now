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



  // cms route loads cms.html
  router.get("/cms", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  // blog route loads blog.html
  router.get("/blog", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/blog.html"));
  });

  // authors route loads author-manager.html
  router.get("/authors", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });

//Manage all the non existant routes
router.get('*', function (req, res) {
  res.redirect('/');
});



module.exports = router;

