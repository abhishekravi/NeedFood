module.exports = function () {

    var userModel = require("./user/user.model.server.js")();

    //master model object.
    var model =
    {
        userModel: userModel
    };
    userModel.setModel(model);

    return model;
};
