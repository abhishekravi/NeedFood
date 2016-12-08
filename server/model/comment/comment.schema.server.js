//place schema
module.exports = function () {
    var mongoose = require("mongoose");
    var CommentSchema = mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        place: {type: mongoose.Schema.Types.ObjectId, ref: 'PlaceModel'},
        text: {type: String},
        rating: {type: Number},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "comment"});
    return CommentSchema;
};


