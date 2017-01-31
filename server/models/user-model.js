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

// Setup dependencies:
var mongoose = require('mongoose');
    // bcrypt could go here if we needed to add in a password hashing

// Setup a schema:
var UserSchema = new mongoose.Schema (
    {
        username: {
            type: String,
            // minlength: 2,
            // maxlength: 20,
            required: true,
            trim: true,
            unique: true, // username must be unique
            dropDups: true,
            // lowercase: true,
        }, // end username field
    },
    {
        timestamps: true,
    }
);

// create function which does basic Validations: (1)
// UserSchema.methods.validateUsername = function(username) {
//     var regex = /^[a-z0-9_]+$/i;
//     return regex.test(username) && username.length > 1 && username.length < 21;
// };

// Instantiate our model and export it:
var User = mongoose.model('User', UserSchema);

// Any pre-save methods would go here.
// UserSchema.pre('save', function(next) {
//     var self = this;
//
//     // check username for basic validations (1 below)
//     console.log('%%%%%%%%%%%%%%%%%%%%%%%% VALIDATION ROUND 1 %%%%%%%%%%%%%%%%%', this.username);
//     if (self.validateUsername(this.username)) {
//         console.log('P A S S E D validation pre save on round 1...');
//         next();
//     } else {
//         console.log('E R R O R - Validation in Round 1 did not pass, generating error now:')
//         var err = new Error('Username must be between 2-19 characters and must contain only letters, numbers or underscores.');
//         // next(err);
//         next(err);
//     };
//     // mongoose query to db case insensitive to check for user (2 below)
//     // next();
//
// });

UserSchema.post('save', function(doc) {
    console.log('User has been saved', doc);
});



// create function which mongoose queries case insensitive for user to see if already exists: (2)


// Any additional instance methods would go here.

// model is exported
module.exports = User;
