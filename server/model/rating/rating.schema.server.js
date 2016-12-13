//rating schema
module.exports = function () {
    var mongoose = require("mongoose");

    var RatingSchema = mongoose.Schema({
        yelpid: {type: String},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        value: {type: Number},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "rating"});
    return RatingSchema;
};


