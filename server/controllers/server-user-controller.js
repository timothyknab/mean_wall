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
        console.log('Login Process (6S): Server now handling information and going to attempt to create a user since existing user could not be found...', req.body);
        require('./controller_modules/user-register-module')(req, res, User);

    },
    login: function(req, res) {
        console.log('Login Process (3S): Server now handling information...Looking to see if user exists...if successful will procceed to login, else will attempt to register...');
        require('./controller_modules/user-login-module')(req, res, User);
    },
};
