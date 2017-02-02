////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     ANGULAR USER FACTORY:
////
////        This file talks to the server-side routes (which talks to the DB).
////        This file passes data to/from the front-end to the back-end, specifically
////        the login form information and any errors that are received. Note: all validations
////        for the login occur in the `user-model.js` file, and all of the queries to the DB occur in the
////        `server-user-controller.js` file.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

app.factory('userFactory', ['$http', function($http) {
    // Setup Factory Object:
    var factory = {};

    // Setup our factory Login method which will (1) first attempt to find a user and if successful, continue to the login process (see: angular-wall-factory.js)
    // else (2) will then attempt to register a user. (3) If user registration validation fails, the $scope will be updated to reflect the error object passed back.
    factory.login = function(user, updateUserCallback, displayErrorsCallback) {
        console.log('Login Process (2C): User factory running...info received and now passing information to server...', user);
        $http.post('/login', user) // send the user info the server, which will first try and query the DB for an existing username.
            .then(function(foundUser) {
                if (!foundUser.data) { // if no user data was returned, register the user:
                    console.log('Login Process (5C): Front end factory talking now...User was not found in database, attempting now to run the /register route and send user info to back-end for creation...');
                    $http.post('/register', user) // because no data was returned, attempt to register the user based on user info
                        .then(function(newUser) {
                            console.log('Login Process (8C): New user SUCCESSFULLY created and received from server...', newUser.data);
                            // after new user is created, run the callback to clear the form fields and redirect to the wall page:
                            updateUserCallback(newUser.data, function() {
                                console.log('Login Process (8C-b): Scope now updated with newly created user...');
                            });
                        })
                        .catch(function(err) { // if error registering user (such as username failing validations), update scope with received error message:
                            console.log('E R R O R  H E R E:', err)
                            console.log('Error Procces (2C): Error registering user, received error from server:', err.data.username.message);
                            displayErrorsCallback(err);
                            /*
                                Development Personal Note: It is weird that here you chose to send back the err only and not err.data (perhaps this was by mistake?)
                                Because we are receiving two different types of error objects: One from built in validations like minlength, maxlength and required,
                                and the second from custom validations like querying for an existing user based on case insensitive regex usernames -- we are presented
                                with some challenges displaying on the front end. I did an if / else check on my server-user-controller.js which sends back the right
                                formatting depending upon the error source. You might want to clean this up, but for now your validations are working correctly.
                            */
                        })
                } else {
                    console.log('Login Process (6C): Existing user has been found in the database...', foundUser.data);
                    updateUserCallback(foundUser.data, function(){ // if user data was found, login the user by redirecting to the wall page:
                        console.log('Login Process (7C): Scope has now been updated as callback function has finished running...FINISHED Login Process Part I...moving onto Part II...');
                    });
                }
            })
            .catch(function(err) { // if the login query goes wrong, the error will be caught here:
                console.log(err);
            })
    };

    // Return Factory Object:
    return factory;
}]);
