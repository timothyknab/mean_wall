////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     ANGULAR WALL FACTORY:
////
////        This file talks to the server-side routes (which talks to the DB).
////        This file passes data to/from the front-end to the back-end.
////        Due to seperation of concerns, this file only handles wall-related controller methods
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

app.factory('wallFactory', ['$http', function($http) {
    // Setup Factory Object:
    var factory = {};

    factory.findUser = function(loginUserScopeCallback) {
        console.log('Login Proccess Part Two (2C): Wall factory now finding user with valid cookie...');
        $http.get('/login')
            .then(function(foundUser) {
                console.log('Login Proccess Part Two (5C): User was successfully retrieved from database based on cookie...updating scope now and login process Part II is complete, user logged in!', foundUser.data);
                loginUserScopeCallback(foundUser.data)
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    factory.logout = function(logoutUserScopeCallback) {
        console.log('Logout Proccess (2C): Logging out user...sending over to server via AJAX to clear out the cookie...');
        $http.get('/logout')
            .then(function(loggedOutMessage) {
                console.log('Logout Proccess (4C): User has been logged out...running callback which will send you back to the index page...');
                console.log(loggedOutMessage);
                logoutUserScopeCallback();
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    factory.newPost = function(newPostMessage, updatePostCallback, displayPostErrorCallback) {
        console.log('Post Proccess (2C): This is the wall factory talking, heres your message:', newPostMessage, '...passing to the Server now via AJAX / $http Service...');
        $http.post('/new', newPostMessage)
            .then(function(newPost) {
                console.log('Post Process (6C): $http promise has finished, here is the data returned from the database:', newPost.data);
                console.log('Post Process (7C): Post process complete, post user updated and post pushed into user...Updating controller now...');
                updatePostCallback();
            })
            .catch(function(err) {
                console.log('Post Error Process (2C): Error creating new post, message from server:', err);
                console.log('Post Error Process (2C-b): Updating controller using callback to display error...');
                displayPostErrorCallback(err.data);
            })
    };

    factory.getAllPosts = function(getAllPostsCallback) {
        console.log('Get All Posts Process (2C): Wall factory talking...running $http service now...');
        $http.get('/posts')
            .then(function(allPosts) {
                console.log('Get All Posts Process (5C): Data returned from server...here are all posts:', allPosts.data);
                console.log('Get All Posts Process (6C): Updating controller now...');
                getAllPostsCallback(allPosts.data);
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    factory.newComment = function(newCommentMessage, newCommentCallback, displayCommentErrorCallback) {
        console.log('Comment Process (2C): Factory talking...adding new comment via $http promise...');
        console.log(newCommentMessage);
        $http.post('/comment', newCommentMessage)
            .then(function(newComment) {
                console.log('Comment Process (4C): New comment received from server:', newComment.data);
                newCommentCallback();
            })
            .catch(function (err) {
                console.log('Comment Error Process (2C): Error creating comment, message received from server: ', err);
                console.log('Comment Error Process (2C-b): Updating scope now with error data...');
                displayCommentErrorCallback(err.data);
            })
    };

    factory.sessionCheck = function(sessionFailureCallback, sessionSuccessCallback) {
        console.log('Session Check Process (2C): Checking for session info...');
        $http.get('/sess')
            .then(function(message) {
                console.log(message.data);
                if (message.data == false) {
                    console.log('Session Check Process (4C): No session deteced...');
                    sessionFailureCallback()
                } else {
                    console.log('Session Check Process (4C-b): Session was detected.');
                    sessionSuccessCallback();
                }
            })
            .catch(function(err) {
                console.log(err);
            })
    }
    // Return Factory Object:
    return factory;
}]);
