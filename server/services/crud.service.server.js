module.exports = function (app, model) {

    app.post('/api/comment', createComment);
    app.put('/api/comment/:cid', updateComment);
    app.put('/api/comment/reply/:cid', saveReply);
    app.put('/api/comment/reply/:cid/:rid', updateReply);
    app.get('/api/:pid/comments', findCommentsForPlace);
    app.get('/api/comments', findUserComments);
    app.get('/api/:uid/allcomments', findAllUserComments);
    app.get('/api/allcomments', getLatestComments);
    app.delete('/api/comment/:cid', deleteComment);
    app.delete('/api/comment/reply/:cid/:rid', deleteReply);


    /**
     * method to find user.
     * @param req
     * request
     * @param res
     * response
     */
    function findCommentsForPlace(req, res) {
        var pid = req.params.pid;
        model.commentModel.findCommentByPlace(pid)
            .then(function (comment) {
                    res.json(comment);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    /**
     * method to update comment.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function updateComment(req, res) {
        var comment = req.body;
        var cid = req.params.cid;
        model.commentModel.updateComment(cid, comment)
            .then(
                function (comment) {
                    res.send(comment);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }

    /**
     * method to find user by username.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function findUserComments(req, res) {
        model.commentModel.findCommentByUser(req.user._id)
            .then(
                function (comments) {
                    res.send(comments);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    /**
     * method to find user by username.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function findAllUserComments(req, res) {
        var uid = req.params.uid;
        model.commentModel.findCommentByUser(uid)
            .then(
                function (comments) {
                    res.send(comments);
                },
                function (error) {
                    res.sendStatus(400);
                });
    }
    
    function getLatestComments(req, res) {
        model.commentModel.findComments()
            .then(function (comments) {
                res.send(comments);
            },
                function (error) {
                    res.send(error);
                });
    }

    /**
     * method to find user by userid.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function findUserById(req, res) {
        var id = req.params.uid;
        model.userModel.findUserById(id)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    /**
     * creates new user.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function createComment(req, res) {
        var comment = req.body.comment;
        var place = req.body.place;
        var yid = place.id;
        model.placeModel.createPlace(place, req.user._id)
            .then(function (placeObj) {
                comment.username = req.user.username;
                model.commentModel.createComment(comment, req.user._id, place)
                    .then(function (comment) {
                        res.send(comment);
                    },function (e) {
                        res.send(e);
                    })
            },function (e) {
                res.send(e);
            });
    }


    /**
     * method to delete user.
     * @param req
     * request
     * @param res
     * response
     */
    function deleteComment(req, res) {
        var cid = req.params.cid;
        model.commentModel.deleteComment(cid)
            .then(
                function (s) {
                    res.sendStatus(200);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }

    function saveReply(req, res) {
        var reply = req.body;
        var cid = req.params.cid;
        model.commentModel.saveReply(cid, reply)
            .then(
                function (comment) {
                    res.send(comment);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }

    function updateReply(req, res) {
        var reply = req.body.reply;
        var cid = req.params.cid;
        var rid = req.params.rid;
        model.commentModel.updateReply(cid,rid, reply)
            .then(
                function (comment) {
                    res.send(comment);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }

    function deleteReply(req, res) {
        var cid = req.params.cid;
        var rid = req.params.rid;
        model.commentModel.deleteReply(cid,rid)
            .then(
                function (s) {
                    res.sendStatus(200);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }
};