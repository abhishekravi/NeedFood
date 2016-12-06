module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model("UserModel", UserSchema);
    // user model apis.
    var api = {
        createUser: createUser,
        findUserById: findUserById,
        updateUser: updateUser,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        deleteUser: deleteUser,
        setModel: setModel,
        findUserByGoogleId: findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId
    };
    return api;

    /**
     * to set master model.
     * @param _model
     */
    function setModel(_model) {
        model = _model;
    }

    /**
     * to create a user
     * @param user
     * user object
     * @returns {user}
     */
    function createUser(user) {
        return UserModel.create(user);
    }

    /**
     * to find user by id.
     * @param id
     * user id
     * @returns {*}
     */
    function findUserById(id) {
        return UserModel.findById(id);
    }

    /**
     * find user by facebook id.
     * @param id
     * @returns {*|Query}
     */
    function findUserByFacebookId(id) {
        return UserModel.findOne(
            {
                'facebook.id': id
            }
        );
    }

    /**
     * find user by google id.
     * @param id
     * @returns {*|Query}
     */
    function findUserByGoogleId(id) {
        return UserModel.findOne(
            {
                'google.id': id
            }
        );
    }

    /**
     * update a user.
     * @param uid
     * user id
     * @param user
     * user object
     * @returns {Query|*}
     */
    function updateUser(uid, user) {
        return UserModel.update(
            {_id: uid},
            {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        );
    }

    /**
     * find user by credentials.
     * @param username
     * username
     * @param password
     * password
     * @returns {*|Query}
     */
    function findUserByCredentials(username, password) {
        return UserModel.findOne(
            {
                username: username,
                password: password
            });
    }

    /**
     * find user by username.
     * @param username
     * @returns {*|Query}
     */
    function findUserByUsername(username) {
        return UserModel.findOne(
            {
                username: username
            }
        );
    }

    /**
     * delete a user
     * @param uid
     * user id
     * @returns {Promise}
     */
    function deleteUser(uid) {
        return UserModel.findOne(
            {_id: uid},
            function (err, user) {
                return model.websiteModel.findAllWebsitesForUser(uid)
                    .then(function (websites) {
                        for (w in websites) {
                            model.pageModel.findAllPagesForWebsite(websites[w]._id)
                                .then(function (pages) {
                                    for (p in pages) {
                                        model.widgetModel.cleanup(pages[p]._id)
                                            .then(function () {
                                                pages[p].remove();
                                            });
                                    }
                                    websites[w].remove();
                                })
                        }
                        user.remove();
                    });
            }
        );
    }
};