////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     ANGULAR USER CONTROLLER:
////
////        Contains user methods which reach into the angular factory (it is
////        in the factory that the server-side routes and server-side controller
////        is reached)
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

app.controller('indexController', ['$scope', 'userFactory', '$location', '$routeParams', function($scope, userFactory, $location, $routeParams) {

    // Setup callback function:
    function updateUserCallback(user, completionFunction) {
        console.log('Update user callback running...');
        $scope.myUser = user;
        $scope.user = {};
        completionFunction();
        $location.url('/messages'); // see note below
        /*
            Note: adding page change in the callback causes the page to change after
            all DB commands have finished -- not having this in my callback
            was causing me some problems where the page was loading before
            the DB had finished gathering its info. By adding the $location service
            to the callback above, like so, now the page ONLY loads AFTER the user
            data has been retrieved from the database.
        */
    };

    function displayErrorsCallback(err) {
        console.log('Error Process (3C): Updating scope to display errors on front end now...');
        console.log('Error Process (3C-b): Here is the error:', err.data.username.message);
        $scope.user = {};
        $scope.errors = err;
    };

    // Setup Login Method in Controller
    $scope.login = function() {
        $scope.errors = {};
        console.log('Login Process (1C): User controller running...beginning login process...handing to angular factory...', $scope.user);
        // $scope.user.username = $scope.user.username.toLowerCase(); // forces username to lowercase before being stored -- this cleared up the validation bug I was hitting
        userFactory.login($scope.user, updateUserCallback, displayErrorsCallback);
    };
}]);
