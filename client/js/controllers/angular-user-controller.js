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
            Note: adding page change in the call back only changes the page after
            all DB commands have finished -- having this in my scope function and
            not in the callback (as it now is) was causing me some problems where
            the page was loading before the DB had finished gathering its info.
        */
    };

    function displayErrorsCallback(err) {
        console.log('Error Process (3C): Updating scope to display errors on front end now...');
        console.log(err);
        $scope.user = {};
        $scope.errors = err;
    };

    // Setup Login Method in Controller
    $scope.login = function() {
        $scope.errors = {};
        console.log($scope.errors);
        console.log('Login Process (1C): User controller running...beginning login process', $scope.user);
        // $scope.user.username = $scope.user.username.toLowerCase(); // forces username to lowercase before being stored -- this cleared up the validation bug I was hitting
        userFactory.login($scope.user, updateUserCallback, displayErrorsCallback);
    };
}]);
