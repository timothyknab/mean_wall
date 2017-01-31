////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     SERVER SIDE ROUTES:
////        This file talks to the server-side controller, which talks to the
////        the DB (Mongo).
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Load controller so routes can access it:
// Remember, the controller is where the actual Mongoose commands live.
var UsersController = require('./../controllers/server-user-controller');
var WallController = require('./../controllers/server-wall-controller');

// Routes go here:
// These routes are used for your Angular Factory to send or retrieve data.
module.exports = function(app) {
    console.log('Server side routes loaded...');
    app.post('/login', UsersController.login)
        .post('/register', UsersController.register)
        .get('/login', WallController.findUser)
        .post('/new', WallController.newPost)
        .get('/logout', WallController.logout)
        .get('/posts', WallController.getPosts)
        .post('/comment', WallController.newComment)
        .get('/sess', WallController.sessionCheck)
};
