module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var RatingSchema = require('./rating.schema.server.js')();
    var RatingModel = mongoose.model("RatingModel", RatingSchema);
    // rating model apis.
    var api = {
        createRating: createRating,
        findRatingById: findRatingById,
        findRatingByPlace: findRatingByPlace,
        findRatingForUsers: findRatingForUsers,
        findRatingByUser: findRatingByUser,
        updateRating: updateRating,
        deleteRating: deleteRating,
        deleteRatingsForUser:deleteRatingsForUser,
        setModel: setModel
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
     * to create a rating
     * @param comment
     * comment object
     * @returns {user}
     */
    function createRating(rating, pid, uid) {
        rating.yelpid = pid;
        rating.user = uid;
        return RatingModel.create(rating);
    }

    /**
     * to find rating by place and user.
     * @param id
     * comment id
     * @returns {*}
     */
    function findRatingByPlace(uid, pid) {
        return RatingModel.findOne({'user':uid, 'yelpid': pid});
    }

    /**
     * to find rating for multiple users.
     * @param id
     * comment id
     * @returns {*}
     */
    function findRatingForUsers(users) {
        var query = {'$or':[]};
        for(u in users){
            query['$or'].push({'user' : users[u]});
        }
        console.log(query);
        return RatingModel.find(query);
    }

    /**
     * to find rating by user.
     * @param id
     * comment id
     * @returns {*}
     */
    function findRatingByUser(uid) {
        return RatingModel.find({'user':uid});
    }

    /**
     * to find rating by id.
     * @param id
     * comment id
     * @returns {*}
     */
    function findRatingById(id) {
        return RatingModel.findById(id);
    }

    /**
     * update a rating.
     * @param cid
     * comment id
     * @param comment
     * comment object
     * @returns {Query|*}
     */
    function updateRating(rid, rating) {
        return RatingModel.update(
            {_id: rid},
            {
                $set: {
                    value: rating.value
                }
            }
        );
    }


    /**
     * delete a rating
     * @param cid
     * comment id
     * @returns {Promise}
     */
    function deleteRating(rid) {
        return RatingModel.remove({_id: rid});
    }

    /**
     * delete ratings for user
     * @param cid
     * comment id
     * @returns {Promise}
     */
    function deleteRatingsForUser(uid) {
        return RatingModel.remove({user: uid});
    }
};