module.exports = function(app) {

    var connectionString = 'mongodb://127.0.0.1:27017/webdev-project';
    if(process.env.MONGODB_URI){
        connectionString = process.env.MONGODB_URI;
    }

    var mongoose = require("mongoose");
    mongoose.connect(connectionString);

    var model = require("./model/models.server.js")();
    require("./services/user.service.server.js")(app, model);
    require("./services/search.service.server.js")(app, model);
};
