module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var CommentSchema = require('./comment.schema.server')();
    var CommentModel = mongoose.model("CommentModel", CommentSchema);
    // user model apis.
    var api = {
        createComment: createComment,
        findCommentById: findCommentById,
        updateComment: updateComment,
        findCommentByUser: findCommentByUser,
        findCommentByPlace: findCommentByPlace,
        findCommentByPlaceUser: findCommentByPlaceUser,
        deleteComment: deleteComment,
        findComments: findComments,
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

    function findComments() {
        return CommentModel.find();
    }

    /**
     * to create a comment
     * @param comment
     * comment object
     * @returns {user}
     */
    function createComment(comment, uid, pid) {
        comment.user = uid;
        comment.yelpid = pid;
        return CommentModel.create(comment);
    }

    /**
     * to find comment by id.
     * @param id
     * comment id
     * @returns {*}
     */
    function findCommentById(id) {
        return CommentModel.findById(id);
    }

    /**
     * update a comment.
     * @param cid
     * comment id
     * @param comment
     * comment object
     * @returns {Query|*}
     */
    function updateComment(cid, comment) {
        return CommentModel.update(
            {_id: cid},
            {
                text: comment.text,
                rating: comment.rating
            }
        );
    }

    /**
     * find comment by user id.
     * @param uid
     * user id
     * @returns {*|Query}
     */
    function findCommentByUser(uid) {
        return CommentModel.find(
            {
                user: uid
            });
    }

    /**
     * find comment by place id.
     * @param pid
     * place id
     * @returns {*|Query}
     */
    function findCommentByPlace(pid) {
        return CommentModel.find({yelpid: pid});
    }

    /**
     * find comment by user and place.
     * @param uid
     * user id
     * @param pid
     * place id
     * @returns {*|Query}
     */
    function findCommentByPlaceUser(uid, pid) {
        return CommentModel.find(
            {
                user: uid,
                place: pid
            }
        );
    }

    /**
     * delete a comment
     * @param cid
     * comment id
     * @returns {Promise}
     */
    function deleteComment(cid) {
        return CommentModel.remove({_id: cid});
    }
};