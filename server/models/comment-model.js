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
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // bcrypt could go here if we needed to add in a password hashing

// Setup a schema:
var CommentSchema = new Schema (
    {
        message: {
            type: String,
            minlength: [2, 'Your comment must be at least 2 characters.'],
            maxlength: [2000, 'Your comment must be less than 2000 characters.'],
            required: [true, 'You cannot submit an empty comment.'],
            trim: true,
        }, // end message field
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
        },
        _post: {
            type: Schema.Types.ObjectId,
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
    this.user = id;
    this.save();
    return true;
};

CommentSchema.methods.updatePostID = function(id) {
    this._post = id;
    this.save();
    return true;
};

// Instantiate our model and export it:
module.exports = mongoose.model('Comment', CommentSchema);
