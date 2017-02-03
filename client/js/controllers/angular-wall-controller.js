////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     ANGULAR WALL CONTROLLER:
////
////        Contains methods which are specific to the logged in user.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

app.controller('wallController', ['$scope', 'wallFactory', '$location', '$routeParams', function($scope, wallFactory, $location, $routeParams) {

    ////////////////////////////
    ///////////////////////////
    ////
    ////    Callback Functions:
    ////
    ///////////////////////////
    ////////////////////////////

    // The functions object below is full of callback functions which we use to update the scope upon completion of our ajax requests.
    var functions = {
        // updates scope to reflect logged in user after logging in:
        loginUserCallback: function(user) {
            console.log('Update wall user callback running...');
            $scope.myUser = user;
            $scope.user = {};
            console.log($scope.myUser);
        },
        // redirects page home after logout:
        logoutUserCallback: function() {
            $location.url('/');
        },
        // upon post submission, clears the text area and then runs get all posts function:
        updatePostCallback: function() {
            $scope.postMessage = {};
            $scope.getAllPosts();
        },
        // once posts are retrieved from DB, this callback function updates scope to reflect all posts:
        showPostsCallback: function(allPosts) {
            console.log('Get All Posts Process Complete: Updating Controller...');

            /*

            Could you insert something here that, after receiving all the posts, iterates through (for loop)
            and queries for each post's comments? Once the comments are returned, here, the data could be put
            together for the front end....

            */

            $scope.allPosts = allPosts;
        },
        // upon comment submission, clears post text area and then run get all posts function:
        newCommentCallback: function() {
            console.log('Comment Process Complete: Updating Controller...');
            $scope.getAllPosts();
        },
        // redirects user to index if no session to prevent wall access:
        sessionFailureCallback: function() {
            console.log('Session invalid, redirecting home...');
            $location.url('/');
        },
        // if session is found then loads posts, comments and user data:
        sessionSuccessCallback: function() {
            console.log('Session valid, loading posts, comments and user data...');
            // once login and session check is successful, user details and all posts are retrieved:
            $scope.findUser();
            $scope.getAllPosts();
        },
        displayPostErrorCallback: function(err) {
            console.log('Post Error Process (3C): Callback running now to update errors to show on views...');
            $scope.errors = err;
        },
        displayCommentErrorCallback: function(err) {
            console.log('Comment Error Process (3C): Callback running and showing comment errors on views...', err);
            $scope.commentErrors = err;
        },
    }; // end callback functions


    ////////////////////////////
    ///////////////////////////
    ////
    ////    $scope Functions:
    ////
    ///////////////////////////
    ////////////////////////////

    // Loads user based on session information:
    $scope.findUser = function() {
        console.log('@@@@@@ Login Proccess Part Two (1C): Looking up user to load information for...using session ID..handing to Wall Factory...');
        wallFactory.findUser(functions.loginUserCallback);
    };

    // Redirects user if no session info home:
    $scope.sessionCheck = function() {
        console.log('^^^^^^ Session Process (1C): Checking if session info exists...');
        wallFactory.sessionCheck(functions.sessionFailureCallback, functions.sessionSuccessCallback)
    };

    $scope.sessionCheck();

    // Upon user log out, clears session information (cookies):
    $scope.logout = function() {
        // logout stuff goes here
        console.log('####### Logout Proccess (1C): Logging out user...sending to Factory...');
        wallFactory.logout(functions.logoutUserCallback);
    };

    // Creates new post upon post submission:
    $scope.newPost = function() {
        // removes any comment or post error messages from views:
        $scope.errors = {};
        $scope.commentErrors = {}
        console.log('$$$$$$$$ Post Proccess (1C): Starting New Post process...passing to Factory...');
        console.log('Post Process (1C-b): Here is your message:', $scope.postMessage);
        wallFactory.newPost($scope.postMessage, functions.updatePostCallback, functions.displayPostErrorCallback);
    };

    // Loads all posts to display on the Wall (/messages) page:
    $scope.getAllPosts = function() {
        console.log('%%%%%%%% Get All Posts Process: (1C): Starting Load All Posts process...passing to Factory...');
        wallFactory.getAllPosts(functions.showPostsCallback);
    };

    // Adds new comment upon comment submission:
    $scope.newComment = function(post) {
        // removes any comment or post error messages from views:
        $scope.errors = {};
        $scope.commentErrors = {};
        console.log('&&&&&&&& Comment Process (1C): Scope talking, grabbing message just entered and sending to factory:', {message: post.comment}, '...when server controller takes over, we will push the current comment into the comments array for said post...');
        wallFactory.newComment({message: post.comment, postID: post._id}, functions.newCommentCallback, functions.displayCommentErrorCallback);
    };

}]);
