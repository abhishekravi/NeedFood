//user schema
module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: {type: String},
        password: {type: String},
        firstName: {type: String},
        lastName: {type: String},
        phone: {type: String},
        homeTown: {type: String},
        email: {type: String},
        google: {
            id: {type: String},
            token: {type: String}
        },
        facebook: {
            id: {type: String},
            token: {type: String}
        },
        role:{type: String, enum:['ADMIN','USER'], default:'USER'},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "user"});
    return UserSchema;
};


