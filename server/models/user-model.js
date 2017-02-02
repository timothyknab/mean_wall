////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     MONGOOSE USER MODEL FILE:
////
////        This file generates the model used for mongo collections (ie, like mysql tables).
////        Validations via mongoose are also setup in this file.
////        This file is linked to the Post model (a user can have many posts).
////
////        Note: Mongoose pre('save') and additional instance (schema) methods are defined here also.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Setup dependencies here (mongoose, bcrypt):
var mongoose = require('mongoose');
// bcrypt could go here if we needed to add in a password hashing later

// Setup a schema:
var UserSchema = new mongoose.Schema (
    {
        username: {
            type: String,
            minlength: [2, 'Username must be at least 2 characters.'],
            maxlength: [20, 'Username must be less than 20 characters.'],
            required: [true, 'Your username cannot be blank.'],
            trim: true,
            unique: true, // username must be unique
            dropDups: true,
        }, // end username field
    },
    {
        timestamps: true,
    }
);

/*
    Note: This function below is an instance method which will validate the username field for
    basic validation (alphanumerical and underscores only).
    These methods are called in the `pre` hook, which is in the code beneath these functions.
*/

// this function runs basic validation on the username field (phase 1):
UserSchema.methods.validateUsername = function(username) {
    console.log('Username Creation Validation: (2S): Phase 1: Assessing for alphanumer characters and underscores...');
    var regex = /^[a-z0-9_]+$/i;
    return regex.test(username);
};

// this function runs a case insensitive query to mongoDB to check for any username duplicate entries:
UserSchema.methods.checkDuplicates = function(username, callback) {
    console.log('Username Creation Validation: (4S): Phase 2 starting now...case insensitive querying mongo for duplicates...');
    User.findOne({username: { $regex : new RegExp(username, "i")}})
        .then(function(foundUser) {
            if(foundUser) { // if user is found, the following error is generated and sent to client (phase 1 passed but phase 2 failed):
                console.log('Username Creation Validation (4S-error): E R R O R...existing user has been found...validation failed...sending new error object to front end...This was the user found:', foundUser);
                var err = new Error('Username already exists.');
                callback(err);
            }
            if(!foundUser) { // if user is not found, then user can proceed to be created (phase 1 and 2 have now passed):
                console.log('Username Creation Validation (4S-success): P A S S E D...no existing users found so we can register this user now...');
                callback();
            }
        })
        .catch(function(err) { // if our regex query goes awry this will catch any errors:
            console.log('Error performing case insensitive query to MongoDB...', err);
            callback(err);
        })
};

// This instantiates our model (which we export at the very end of this file):
var User = mongoose.model('User', UserSchema);

// This pre save hook puts our instance methods above together, so that prior to saving a new
// user, the username is validated for basic validation, and then checked for duplicates (no matter the case)
// in mongoDB.
UserSchema.pre('save', function(next) {
    var self = this;
    // check username for basic validations (alphanumer and underscores):
    console.log('Username Creation Validation Process (1S): Pre Save hook in model now running...starting Phase 1:', this.username);
    if (self.validateUsername(this.username)) { // if phase 1 validation returns as true, check for duplicates (phase 2)
        console.log('Username Creation Validation (3S-success): P A S S E D basic validation Phase 1...staring now Phase 2 for checking for case insensitive duplicates...');
        // case insensitive mongoose query to see if user exists in other case format:
        self.checkDuplicates(this.username, next);
    } else { // if phase 2 fails, throw this erorr and send back to client:
        console.log('Username Creation Validation (3S-error): E R R O R - Validation in Round 1 did not pass, generating error now for front end...');
        var err = new Error('Username may contain only letters, numbers or underscores.');
        console.log(err);
        next(err);
    };
});

// This post hook runs after our save has completed:
UserSchema.post('save', function(doc) {
    console.log('Username Creation Validation (COMPLETE): User has been successfully validated and saved', doc);
});

// Finally, our module is exported:
module.exports = User;
