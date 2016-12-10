//place schema
module.exports = function () {
    var mongoose = require("mongoose");

    var CommentSchema = mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        yelpid: {type: String},
        placename: {type: String},
        username: {type: String},
        text: {type: String},
        replies: [{
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
            text: {type: String},
            username: {type: String},
            dateCreated: {type: Date, default: Date.now()}
        }],
        rating: {type: Number},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "comment"});
    return CommentSchema;
};


