////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     SERVER FILE:
////
////        This file sets up our entire express application, calling in necessary
////        dependencies, setting up static folders, connecting to the database,
////        connecting to database models (mongoose), sets up server side Routing
////        (for db queries) and runs the app on a selected port.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Setup App Dependencies:
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    port = 8000;

// Configure App, Setup Static Folders (possibly setup Session if using)
require('./config/app')(express, app, bodyParser, path);

// Setup Mongoose and Models:
require('./config/db');

// app.use(function(req, res, next) {
//     var User = require('mongoose').model('User')
//
//     if (req.session.userID) {
//         User.findById(req.session.userID)
//             .then(function(user) {
//                 req.user = user;
//                 next();
//             })
//             .catch(next);
//     }
//
//     next(new Error('user not logged in'));
// ;})

// Setup Server-Side Routing:
require('./config/routes')(app);

// Setup Server to Listen and Run:
app.listen(port, function() {
    console.log('Server listening on port:', port);
});
