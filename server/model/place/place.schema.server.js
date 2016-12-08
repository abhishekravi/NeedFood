//place schema
module.exports = function () {
    var mongoose = require("mongoose");
    var PlaceSchema = mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        yelpid: {type: String, required:true},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "place"});
    return PlaceSchema;
};


