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
        console.log('Login Proccess Part Two (3S): Server handling data now, looking up user with following session ID:', req.session.userID);
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
                // now we look up this user based upon their ID so we can also assign a username to the post (easier for displaying on the views end):
                User.findById(req.session.userID)
                    .then(function(foundUser) {
                        console.log('Post Process (5S): User found...here is the user data:', foundUser, '...updating username now...');
                        // assigns the found username to the newly created post:
                        newPost.updateUsername(foundUser.username);
                        return res.json(newPost);
                    })
                    .catch(function(err) {
                        console.log('Error finding user...', err);
                    })
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
        console.log('Get All Posts Process (3S): Server-side wall controller running...going to ping DB now for all posts...');
        // Look up all posts via mongoose from our mongoDB:
        Post.find({})
            .then(function(allPosts) {


                // res.json(allPosts);

                for (var i = 0; i < allPosts.length; i++) {
                    console.log('/////////////////////');
                    console.log('/////////////////////');
                    console.log({
                        post: allPosts[i],
                        index: i,
                        allPostsLength: allPosts.length,
                    });
                    _post = allPosts[i]; // created '_post' to attempt to capture the post for use in the query below (where it seemed `allPosts[i]` was no longer accessible)
                    PostComment.find({postID: allPosts[i]._id}) // due to the asynchronicity of this event, our '_post' and 'i' variables below become off-pace with the data above this query
                        .then(function(comments) {
                            console.log('^^^^^^^^^^^^^^^^^^');
                            console.log('^^^^^^^^^^^^^^^^^^');
                            console.log({
                                post: _post, // _post here is changed above before the data is returned
                                comments: comments,
                                index: i,
                            })
                            console.log('^^^^^^^^^^^^^^^^^^');
                            console.log('^^^^^^^^^^^^^^^^^^');
                        })
                    console.log('/////////////////////');
                    console.log('/////////////////////');
                };


                // for (var idx in allPosts) {
                //     console.log('/////////////////');
                //     console.log('/////////////////');
                //     console.log('/////////////////');
                //     console.log('/////////////////');
                //     console.log({
                //         post: allPosts[idx],
                //         index_value: idx,
                //         postArrayLength: allPosts.length,
                //     });
                //     console.log('/////////////////');
                //     console.log('/////////////////');
                //     console.log('/////////////////');
                //     console.log('/////////////////');
                //
                //     var _post = allPosts[idx];
                //
                //     PostComment.find({postID: _post._id})
                //         .then(function(postComments) {
                //             console.log('>>>>>>>>>>>>>>>>>>>>');
                //             console.log({
                //                 post: _post,
                //                 postComments: postComments,
                //                 index_value: idx,
                //             });
                //             console.log('<<<<<<<<<<<<<<<<<<<<');
                //         })
                //         .catch(function(err) {
                //             console.log(err);
                //         })
                //
                //     if (idx == allPosts.length-1) {
                //         console.log('WE DONE');
                //     }
                //
                //     console.log('Ending round');
                // }

                res.send('Cool');
                ////////////////////////////////////////////////////////
                ///////////////// D O  S O M E T H I N G ///////////////
                ////////////////////////////////////////////////////////
                /*                                                    */
                /* Do Something Here to Look Up Each post (for loop?) */
                /* For each post, use the post ID & find all comments */
                /* Then return an object which includes all each post */
                /* and all comments (this may or may not be easy)     */
                /*                                                    */
                ////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////
                //
                // var postsWithComments = [];
                // console.log('////////////////// A L L   P O S T S //////////////////');
                // console.log(allPosts);
                // console.log('///////////// E N D   A L L   P O S T S //////////////');
                //
                // for (var i = 0; i < allPosts.length; i++) {
                //
                //     var thisPost = allPosts[i];
                //
                //     PostComment.find({postID: thisPost._id})
                //     .then(function(allPostComments){
                //         console.log('//// P O S T   I D: ' + thisPost._id + ' ////');
                //         thisPost.comments = allPostComments;
                //         thisPost.save();
                //         postsWithComments.push(thisPost);
                //         console.log('//// C O M M E N T S ////');
                //         console.log(thisPost.comments);
                //         console.log('//// P U S H E D  S O  F A R /////');
                //         console.log(postsWithComments);
                //         if (i == allPosts.length) {
                //             console.log('//////// P O S T S  L O O P  C O M P L E T E /////////');
                //             console.log(postsWithComments);
                //             console.log('Get All Posts Process (4S): All Posts and comments retrieved:', postsWithComments);
                //             return res.json(postsWithComments);
                //         }
                //     })
                //     .catch(function(err) {
                //         console.log()
                //     })
                // }
                //
                // /*
                //
                //     Find Posts /done
                //
                //     Loop through allPosts /done
                //
                //         For each, find comments /done
                //
                //         Add comments to each post (as `comments`) /done
                //
                //         res.json the now updated allPosts objects (with attached comments) /done
                //
                //
                // */
                //
                //
                ////////////////////////////////////////////////////////
                //////////////// E N D  S O M E T H I N G //////////////
                ////////////////////////////////////////////////////////
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json(err);
            })
    },
    newComment: function(req, res) {
        console.log('Comment Process (2S): Server controller talking now...creating comment with data:', req.body);
        // creates the new comment object in mongo:
        PostComment.create(req.body)
            .then(function(newComment) {
                console.log('Comment Process (3S): Comment created:', newComment);
                console.log('Comment Process (3S-b): Assigning comment to currently logged in user session ID...');
                // once new comment is created, assigns userID to comment based on currently logged in user:
                newComment.updateUserID(req.session.userID);
                console.log('Comment Process (3S-c): Looking up user session ID and appending username to comment...');
                // looks up the user based upon current session ID, so that we can also add a username to the comment:
                /*

                    [CODE IMPROVEMENT SCENARIO 1]:
                    Note: For both the `newComment` and `newPost` methods here, you can improve and streamline your code by
                    adding the username to the `req.session.username`, so that any logged in user's username and ID are both ready to go
                    to prevent these unncessary additional mongoose queries.

                    [CODE IMPROVEMENT SCENARIO 2]:
                    Note: Instead of scenario 1, you could use middleware like Jason showed you, so that if a user is currently logged in,
                    that user is stored directly in the `req` object itself, and would also prevent these additional mongoose queries and
                    the addition of a second session object. (more difficult, but worth trying to practice `next()` in express).

                */
                // looks up user based on session info so we can add a username to the comment for ease of use on the front end:
                User.findById(req.session.userID)
                    .then(function(user) {
                        // sets username from session lookup to the username on the comment:
                        newComment.updateUsername(user.username);
                        console.log('Comment Process (3S-d): username on comment has been updated...');


                        return res.json({user: user, comment: newComment});


                        ////////////////////////////////////////////////////////
                        ////////////////   D U P L I C A T I O N  //////////////
                        ////////////////////////////////////////////////////////
                        // now we look up the actual post, based upon the comment's postID so that we can push the comment into the post array:
                        // Post.findById(newComment.postID)
                        //     .then(function(foundPost) {
                        //         // pushes the new comment into the post.comments array:
                        //         /////////////////////////////
                        //         ///     THIS IS WHERE     ///
                        //         ///    THE DUPLICATION    ///
                        //         ///      HAS OCCURRED     ///
                        //         /////////////////////////////
                        //         foundPost.addComment(newComment);
                        //         console.log('Comment Process (3S-e): comment has been successfully pushed into post.comments array...sending back the user whom commented, the comment, and the post it belongs to...');
                        //         return res.json({
                        //             user: user,
                        //             comment: newComment,
                        //             post: foundPost,
                        //         });
                        //     })
                        //     .catch(function(err) {
                        //         console.log(err);
                        //         return res.status(500).json(err);
                        //     })
                        ////////////////////////////////////////////////////////
                        //////////////   E N D   D U P L I C A T E  ////////////
                        ////////////////////////////////////////////////////////
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
