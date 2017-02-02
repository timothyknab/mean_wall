module.exports = function(req, res, User) {
    /*
        Note: When `.create()` runs, it will go to the Mongoose Schema, where the validations live.
        Any errors will flag the `.catch()` function (very handy), otherwise the user will be created.
        See both server and client consoles for information about this process.
    */
    // Creates a new user based on req.body:
    User.create(req.body)
        .then(function(newUser) {
            console.log('%%%%%% NEW USER CREATED %%%%%');
            console.log('Login Process (7S): New user SUCCESSFULLY created...sending new user data to front end now...', newUser);
            req.session.userID = newUser._id; // sets session ID to new user ID from mongo
            return res.json(newUser); // sends back new user
        })
        .catch(function(err) {
            console.log('%%%%%% ERROR SAVING USER %%%%%%');
            console.log('----- Begin Error: -----');
            console.log(err.message);
            console.log('----- End Error: -----');
            if (err.errors == null) {
                console.log('CUSTOM VALIDATION ERROR OBJECT DETECTED...formatting now and sending to front end:');
                res.status(500).json({username: {message: err.message}});
            } else {
                console.log('BUILT IN VALIDATION OBJECT DETECTED...formatting now and sending to front end:');
                res.status(500).json({username: {message: err.errors.username.message}});
            }
        })
};
