////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////    SERVER SIDE USER MODULE:
////
////        This MODULE (**Not Mongoose Model**) contains some validation functions
////        for when registering a new user. The new user is first given a regex test
////        to ensure that only valid characaters have been submitted. Then, the user
////        is queried in the DB to see if an existing user exists. This seems like
////        something that mongoose can do natively, but this only works if the username
////        submitted matches the exact case of the mongoose document. Because we are wanting
////        to query our mongoDB using a case insensitive query, we use a special regex style
////        of querying (after confirming characters are valid) to see if the user exists.
////
////        If an existing user is found, an error is sent back. If the user is not found, and
////        passes all regex for valid characters, and min and max length, the user is then created.
////        If it fails any of these tests, errors are flagged to the front end.
////
////        Note: This file also sets up session info after a new user is created.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

module.exports = function(req, res, User) {
    console.log('Login Process (6S): Server now handling information and going to attempt to create a user...', req.body);
    // creates a function which will test a regex pattern for alphanumerical characters, case insensitive, with underscores only (no other characters)
    function testRegex(username) {
        var rgex = /^[a-z0-9_]+$/i;
        return rgex.test(username);
    }
    // this if statement checks for (a) if an empty form has been submitted (2) if the username passes the regex for alphanumer+valid characters defined
    // above (3) if length is less than 2 and (4) if length is greater than 19. If any of these conditions are met, the error message is flagged.
    if (!req.body.username || !testRegex(req.body.username) || req.body.username.length < 2 || req.body.username.length > 19) {
        res.status(500).json({data: {username: {message: 'Username may contain only letters, numbers or underscores and must be between 2-19 characters in length.'}}});
    } else { // if none of the above errors are flagged, the user is then searched using a regex-friendly **case insensitive** query for mongoose to see if there are any matches:
        // note: it is the case insensitivt issue which is why all of this validation becomes so complicated
        User.findOne({username: { $regex : new RegExp(req.body.username, "i")}})
        .then(function(user) {
            if (user) { // if a user is found based on a case insensitive search, we have to send an error telling user to choose a new username
                return res.status(500).json({data: {username: {message: 'User with this username already exists.'}}});
            }
            if (!user) { // if no user comes up, at this point we already passed our basic validation of length and valid characters, so we can now create our user:
                User.create(req.body)
                .then(function(newUser) {
                    console.log('Login Process (7S): New user SUCCESSFULLY created...', newUser);
                    req.session.userID = newUser._id; // sets session ID to new user ID from mongo
                    console.log('Login Process (8S): Cookie created for new user...going back to front end now...', req.session.userID);
                    return res.json(newUser)
                })
                .catch(function(err) { // for any errors in the user creation process
                    console.log('Error Process (1S): Error creating Mongoose Schema with user...sending errors to front end now:', err);
                    return res.status(500).json(err);
                })
            }
        })
        .catch(function(err) { // error message if the regex query fails for some reason
            console.log('Login Process (7S-error): Error looking up user based on regex pattern', err);
        })
    }
}
