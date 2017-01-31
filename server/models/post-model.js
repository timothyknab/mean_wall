////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     MONGOOSE POST MODEL FILE:
////
////        This file generates the model used to create Posts for users.
////        This file also associates to the user model (many posts can exist for single users)
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Setup dependencies:
var mongoose = require('mongoose');
    // bcrypt could go here if we needed to add in a password hashing

// Setup a schema:
var PostSchema = new mongoose.Schema (
    {
        message: {
            type: String,
            minlength: 2,
            maxlength: 2000,
            /*
                Note: the above is commented out because we are doing custom validations below.
                If we had left the above uncommented, they would override the validator function below.
                Secondly, the clarify, `minlength` is literally the minimum length (2), (ie, 1 is unaccepted but 2 is accepted) -- the same for maxlength.
            */
            required: true,
            trim: true,
            validate: {
                validator: function(message) {
                    return message.length > 1 && message.length < 2001;
                },
                message: 'Your post message must be at least 2 characters and less than 2000 characters in length.'
            }
        }, // end message field
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
        },
        comments: [],
    },
    {
        timestamps: true,
    }
);

// Any pre-save methods would go here.

// Any additional instance methods would go here.

// updates userID based upon current session login info:
PostSchema.methods.updateUserID = function(id) {
    this.userID = id;
    this.save();
    return true;
};

// updates username based on found username based on session ID:
PostSchema.methods.updateUsername = function(username) {
    this.username = username;
    this.save();
    return true;
};

// adds comment to post's comments array:
PostSchema.methods.addComment = function(comment) {
    this.comments.push(comment);
    this.save();
    return true;
};

// Instantiate our model and export it:
module.exports = mongoose.model('Post', PostSchema)
// model is exported as the name of 'Post' using the 'PostSchema' defined above.
