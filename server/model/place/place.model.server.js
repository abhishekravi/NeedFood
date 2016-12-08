module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var PlaceSchema = require('./place.schema.server')();
    var PlaceModel = mongoose.model("PlaceModel", PlaceSchema);
    // user model apis.
    var api = {
        createPlace: createPlace,
        findPlaceById: findPlaceById,
        updatePlace: updatePlace,
        findPlaceByUser: findPlaceByUser,
        deletePlace: deletePlace,
        findPlaceByYelpId: findPlaceByYelpId,
        deletePlacesForUser: deletePlacesForUser,
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
     * to create a place
     * @param place
     * place object
     * @returns {user}
     */
    function createPlace(yelpid, uid) {
        var placeObj ={
            user: uid,
            yelpid: yelpid
        };
        return PlaceModel.findOneAndUpdate({yelpid:yelpid},placeObj,{upsert:true});
    }

    /**
     * to find place by id.
     * @param id
     * place id
     * @returns {*}
     */
    function findPlaceById(id) {
        return PlaceModel.findById(id);
    }

    /**
     * to find place by id.
     * @param id
     * place id
     * @returns {*}
     */
    function findPlaceByYelpId(id) {
        return PlaceModel.findOne({yelpid:id});
    }



    /**
     * update a user.
     * @param pid
     * user id
     * @param place
     * user object
     * @returns {Query|*}
     */
    function updatePlace(pid, place) {
        return PlaceModel.update(
            {_id: pid},
            {
                yelpid: place.yelpid
            }
        );
    }

    /**
     * find place by userid.
     * @param uid
     * @returns {*|Query}
     */
    function findPlaceByUser(uid) {
        return PlaceModel.findOne(
            {
                user: uid
            }
        );
    }

    /**
     * delete a place
     * @param pid
     * place id
     * @returns {Promise}
     */
    function deletePlace(pid) {
        return PlaceModel.remove(
            {_id: pid}
        )
    }

    /**
     * delete a place
     * @param pid
     * place id
     * @returns {Promise}
     */
    function deletePlacesForUser(uid) {
        return PlaceModel.remove(
            {user: uid}
        )
    }
};