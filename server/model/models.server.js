module.exports = function () {

    var userModel = require("./user/user.model.server.js")();
    var placeModel = require("./place/place.model.server.js")();
    var commentModel = require("./comment/comment.model.server.js")();
    var ratingModel = require("./rating/rating.model.server.js")();

    //master model object.
    var model =
    {
        userModel: userModel,
        placeModel: placeModel,
        commentModel: commentModel,
        ratingModel: ratingModel
    };

    userModel.setModel(model);
    placeModel.setModel(model);
    commentModel.setModel(model);
    ratingModel.setModel(model);

    return model;
};
