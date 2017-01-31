////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////    SERVER SIDE USER CONTROLLER
////
////        This file actually talks to the DB (Mongo) via Mongoose commands.
////        Data here is returned to the Angular Factory in promise form. (if
////        requested this way).
////
////        Note: Methods in this file are being called ultimately from the front-end.
////        The angular controller hits the angular factory, which uses $http promises
////        to hit the server side routes file, which ultimately reaches into this file.
////        Data returned from methods in this file most likely are handed back to the
////        controller as an "answer" to said promise.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Grab our Mongoose Model for 'User' (that's the name we chose)
var User = require('mongoose').model('User');

module.exports = {
    // Find an existing username:
    register: function(req, res) {
        require('../modules/user-helper-module')(req, res, User);

    },
    login: function(req, res) {
        console.log('Login Process (3S): Server now handling information...Looking to see if user exists first...');
        User.findOne({username: req.body.username})
            .then(function(foundUser) {
                if (!foundUser) {
                    console.log('Login Process (4S): User was NOT found, preparing to create...going back to front end...');
                    return res.json(foundUser);
                } else {
                    console.log('Login Process (4S): User has been SUCCESSFULLY found...', foundUser._id);
                    req.session.userID = foundUser._id; // sets session ID to user id from Mongo
                    console.log('Login Process (5S): Cookie has been created for found user....going back to front end now...', req.session.userID);
                    return res.json(foundUser);
                }
            })
            .catch(function(err) {
                console.log(err);
                return res.json(err);
            })
    },
};
