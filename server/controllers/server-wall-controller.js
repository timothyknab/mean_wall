////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////    SERVER SIDE WALL CONTROLLER:
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
var Post = require('mongoose').model('Post');
var PostComment = require('mongoose').model('Comment');

module.exports = {

    // Find an existing user in the database based on session ID (cookie value):
    findUser: function(req, res) {
        // return res.json(req.user);
        // note that the above return is only valid if you were using some sort of middle ware on the front that gathers the user
        // see the `server/server.js` file to better understand how the above fits in
        console.log('Login Proccess Part Two (3S): Server handling data now, looking up user with following session ID:', req.session.userID);  /// <<<<======= HERE IS WHERE ISSUE OCCURRS
        // console.log('....... findUser .......');
        // console.log('%%%%%%%% SESSION %%%%%%%');
        // console.log(req.session.userID);
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%');
        // console.log('');
        // console.log('%%%%%%% REQ USER %%%%%%%');
        // console.log(req.user);
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%');
        // console.log('........................');
        User.findOne({_id: req.session.userID})
            .then(function(foundUser) {
                console.log('Login Proccess Part Two (4S) Database has found user based on ID...', foundUser, 'Sending back to front-end now...');
                return res.json(foundUser);
            })
            .catch(function(err) {
                console.log('Error when trying to find user in Database...', err);
                return res.status(500).json(err);
            })
    },

    // Creates a new post for logged in user:
    newPost: function(req, res) {
        // var user = req.user;
        // only imporant above if using middleware as showcased on the index page
        console.log('Post Proccess (3S): newPost method now running on your server controller...');
        console.log('Post Proccess (3S-b): Here is the content of your post:', req.body, 'Creating post in database now...');
        // first we create a new post based upon post form data:
        Post.create(req.body)
            .then(function(newPost) {
                console.log('Post Process (4S): Your post has been created:', newPost, '...Adding post to user, looking up user now...');
                // once new post is created, we assign the post's userID to the logged in user:
                newPost.updateUserID(req.session.userID);
                return res.json(newPost);
            })
            .catch(function(err) {
                console.log('Post Error Process (1S): Error creating new post...', err);
                return res.status(500).json(err);
            })

    },

    // Logs out logged in user and clears out cookies:
    logout: function(req, res) {
        console.log('Logout Proccess (3S): Running logout method on server controller...going to end your session now...');
        console.log('Logout Proccess (3S-a): First, let us examine your previous ID:', req.session, req.session.userID);
        req.session.destroy();
        console.log('Logout Proccess (3S-b): Now after destroying() it this is your session now:', req.session);
        console.log('Logout Proccess (3S-c): Handing you back to the front end now...');
        var message = 'You have been successfully logged out.';
        return res.json(message);
    },

    // Gets all posts:
    getPosts: function(req, res) {
        // console.log('....... getPosts .......');
        // console.log('%%%%%%%% SESSION %%%%%%%');
        // console.log(req.session.userID);
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%');
        // console.log('');
        // console.log('%%%%%%% REQ USER %%%%%%%');
        // console.log(req.user);
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%');
        // console.log('........................');
        console.log('Get All Posts Process (3S): Server-side wall controller running...going to ping DB now for all posts...');
        Post.find({})
            .populate('user')
            .populate({
                path: 'comments',
                populate: {  path: 'user' }
            })
            .exec()
            .then(function(commentsAndPosts) {
                return res.json(commentsAndPosts);
            })
            .catch(function(err) {
                console.log(err);
            })
    },

    newComment: function(req, res) {
        console.log('Comment Process (2S): Server controller talking now...creating comment with data:', req.body);
        // Creates the new comment object in mongo:
        PostComment.create(req.body)
            .then(function(newComment) {
                console.log('Comment Process (3S): Comment created:', newComment);
                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$');
                console.log(req.body.postID);
                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$');
                console.log('Comment Process (3S-b): Assigning comment to currently logged in user session ID...');
                // Once new comment is created, logs the user using the userID:
                newComment.updateUserID(req.session.userID);
                console.log('Comment Process (3S-c): Adding postID to comment...');
                newComment.updatePostID(req.body.postID);
                console.log('Comment Process (3S-d): Looking up user session ID and appending username to comment...');
                console.log(newComment);
                // look up relevant post:
                Post.findById(req.body.postID)
                    .then(function(relevantPost) {
                        // Adds comment._id to `comments` array inside of post:
                        relevantPost.addComment(newComment._id);
                        return res.json({
                            comment: newComment,
                            post: relevantPost,
                        });

                    })
                    .catch(function(err) {
                        console.log(err);
                        return res.status(500).json(err);
                    })

            })
            .catch(function(err) {
                console.log('Comment Error Process (1S): Server cannot create mongoose comment document, sending error to front end:', err);
                return res.status(500).json(err);
            })
    },

    sessionCheck : function(req, res) {
        console.log('Session Check Process (3S): Checking if session exists now...');
        console.log(req.session.userID);
        if (!req.session.userID) {
            console.log('Session Check Process (3S-b): Session not detected...');
            return res.json(false);
        } else {
            console.log('Session Check Process (3S-c): Session detected...');
            return res.json(true);
        }
    }
};
