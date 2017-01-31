////////////////////////////////////
//////////////////////////////////
////////////////////////////////
////
////     MONGOOSE COMMENT MODEL FILE:
////
////        This file generates the model used to create Comments for users.
////
////////////////////////////////////
//////////////////////////////////
////////////////////////////////

// Setup dependencies:
var mongoose = require('mongoose');
// bcrypt could go here if we needed to add in a password hashing

// Setup a schema:
var CommentSchema = new mongoose.Schema (
    {
        message: {
            type: String,
            minlength: 2,
            maxlength: 2000,
            required: true,
            trim: true,
            validate: {
                validator: function(message) {
                    return message.length > 1 && message.length < 2001;
                },
                message: 'Your comment message must be at least 2 characters and less than 2000 characters in length.'
            }
        }, // end message field
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
        },
        postID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
    },
    {
        timestamps: true,
    }
);

// Any pre-save methods would go here.

// Any additional instance methods would go here.
CommentSchema.methods.updateUserID = function(id) {
    this.userID = id;
    this.save();
    return true;
};

CommentSchema.methods.updateUsername = function(username) {
    this.username = username;
    this.save();
    return true;
};

// Instantiate our model and export it:
module.exports = mongoose.model('Comment', CommentSchema)
// model is exported as the name of 'Comment' using the 'CommentSchema' defined above.
