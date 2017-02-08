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
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // bcrypt could go here if we needed to add in a password hashing

// Setup a schema:
var PostSchema = new Schema (
    {
        message: {
            type: String,
            minlength: [2, 'Your post must be at least 2 characters.'],
            maxlength: [2000, 'Your post must be less than 2000 characters.'],
            required: [true, 'You cannot submit an empty post.'],
            trim: true,
        }, // end message field
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    {
        timestamps: true,
    }
);

// updates userID based upon current session login info:
PostSchema.methods.updateUserID = function(id) {
    this.user = id;
    this.save();
    return true;
};


// adds comment to post's comments array:
PostSchema.methods.addComment = function(commentID) {
    this.comments.push(commentID);
    this.save();
    return true;
};

// Instantiate our model and export it:
module.exports = mongoose.model('Post', PostSchema);
