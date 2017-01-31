////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     ANGULAR USER FACTORY:
////
////        This file talks to the server-side routes (which talks to the DB).
////        This file passes data to/from the front-end to the back-end.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

app.factory('userFactory', ['$http', function($http) {
    // Setup Factory Object:
    var factory = {};

    factory.login = function(user, updateUserCallback, displayErrorsCallback) {
        console.log('Login Process (2C): User factory running...passing information to server now...', user);
        // $http requests go here
        // hit a route which checks database for a username
        // if it finds it, return it
        $http.post('/login', user)
            .then(function(foundUser) {
                if (!foundUser.data) {
                    console.log('Login Process (5C): User not found in database, sending user back to back-end for creation now...');
                    $http.post('/register', user)
                        .then(function(newUser) {
                            console.log('Login Process (9C): New user SUCCESSFULLY created and received from server...', newUser.data);
                            updateUserCallback(newUser.data, function() {
                                console.log('Login Process (9C-a): Scope now updated with newly created user...');
                            })
                        })
                        .catch(function(err) {
                            console.log('^^^^^^^^^^^^^^^^^', err);
                            console.log('Error Procces (2C): Error registering user, received error from server:', err);
                            displayErrorsCallback(err.data);
                        })
                } else {
                    console.log('Login Process (6C): Existing user has been found in the database...', foundUser.data);
                    updateUserCallback(foundUser.data, function(){
                        console.log('Login Process (7C): Scope has now been updated as callback function has finished running...FINISHED Login Process Part I...moving onto Part II...');
                    });
                }
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    // Return Factory Object:
    return factory;
}]);
