module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var CommentSchema = require('./comment.schema.server')();
    var CommentModel = mongoose.model("CommentModel", CommentSchema);
    // comments model apis.
    var api = {
        createComment: createComment,
        findCommentById: findCommentById,
        updateComment: updateComment,
        findCommentByUser: findCommentByUser,
        findCommentByPlace: findCommentByPlace,
        findCommentByPlaceUser: findCommentByPlaceUser,
        deleteComment: deleteComment,
        findComments: findComments,
        deleteCommentForUser: deleteCommentForUser,
        saveReply: saveReply,
        updateReply: updateReply,
        deleteReply: deleteReply,
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
     * find latest ten comments
     * @returns {Array.<T>|Query|Aggregate|*}
     */
    function findComments() {
        return CommentModel.find().limit(10).sort({"dateCreated": -1});
    }

    /**
     * to create a comment
     * @param comment
     * comment object
     * @returns {user}
     */
    function createComment(comment, uid, place) {
        comment.user = uid;
        comment.yelpid = place.id;
        comment.placename = place.name;
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
                $set: {
                    text: comment.text
                }
            }
        );
    }

    /**
     * create a reply.
     * @param cid
     * comment id
     * @param comment
     * comment object
     * @returns {Query|*}
     */
    function saveReply(cid, reply) {
        return CommentModel.findByIdAndUpdate(
            cid, {$push: {"replies": reply}},{upsert:true}
        );
    }

    /**
     * update a reply
     * @param cid
     * @param rid
     * @param reply
     * @returns {Query|*}
     */
    function updateReply(cid, rid, reply) {
        return CommentModel.update(
            {
                _id: cid,
                'replies._id': rid
            },
            {$set: {'replies.$.text': reply.text}}
        );
    }

    /**
     * delete a reply
     * @param cid
     * @param rid
     * @returns {Query|*}
     */
    function deleteReply(cid, rid) {
        return CommentModel.update(
            {
                _id: cid,
                'replies._id': rid
            },
            {$pull: {'replies' : {_id: rid}}}
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

    /**
     * delete a comment
     * @param cid
     * comment id
     * @returns {Promise}
     */
    function deleteCommentForUser(uid) {
        return CommentModel.remove({user: uid});
    }
};