module.exports = function(req, res, User) {
    // First a user is queried for, if the data returned is empty, sends back the user, else adds session information then sends back data with found user:
    User.findOne({username: req.body.username})
        .then(function(foundUser) {
            console.log(foundUser);
            if (foundUser) {
                console.log('Login Process (4S-success): Success...User has been SUCCESSFULLY found...', foundUser._id);
                req.session.userID = foundUser._id; // sets session ID to user id from Mongo
                console.log('Login Process (5S): Cookie has been created for found user....going back to front end now...', req.session.userID);
            } else {
                console.log('Login Process (4S-error): Failed...User was not found in DB, preparing to create now...sending back empty object to front end...');
            };
            return res.json(foundUser);
        })
        .catch(function(err) {
            console.log('Login Process (3S-error): Error trying to query MongoDB based on username:', err);
            return res.json(err);
        })
};
