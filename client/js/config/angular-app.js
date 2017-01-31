////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     ANGULAR APP CONFIG:
////
////        Contains app module setup and Angular Routing or other services.
////        This app is essential in creating the basis for our Angular front-end.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Define Module:
var app = angular.module('app', ['ngRoute']);

// Define Routes:
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/index.html', // root route partial
            controller: 'indexController',
        })
        .when('/messages', {
            templateUrl: 'html/messages.html', // loads after login/registration
            controller: 'wallController',
        })
        .otherwise({
            redirectTo: '/',
        })
});
