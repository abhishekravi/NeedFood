module.exports = function (app, model) {

    app.post('/api/rating/:uid/:pid', createRating);
    app.get('/api/rating/:uid/:pid', findRatingByUserPlace);
    app.get('/api/rating/:uid', findRatingByUser);
    app.post('/api/rating', findRatingForUsers);
    app.put('/api/rating/:rid', updateRating);
    app.delete('/api/rating/:rid', deleteRating);

    /**
     * method to rating for user and place.
     * @param req
     * request
     * @param res
     * response
     */
    function findRatingByUserPlace(req, res) {
        var pid = req.params.pid;
        var uid = req.params.uid;
        model.ratingModel.findRatingByPlace(uid, pid)
            .then(function (rating) {
                    res.json(rating);
                },
                function (error) {
                    res.send(error);
                });
    }

    /**
     * find user ratings
     * @param req
     * @param res
     */
    function findRatingByUser(req, res) {
        var uid = req.params.uid;
        model.ratingModel.findRatingByUser(uid)
            .then(function (rating) {
                    res.json(rating);
                },
                function (error) {
                    res.send(error);
                });
    }

    /**
     * find ratings for multiple users.
     * @param req
     * @param res
     */
    function findRatingForUsers(req, res) {
        var users = req.body;
        model.ratingModel.findRatingForUsers(users)
            .then(function (rating) {
                    res.json(rating);
                },
                function (error) {
                    res.send(error);
                });
    }

    /**
     * method to update rating.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function updateRating(req, res) {
        var rating = req.body;
        var rid = req.params.rid;
        model.ratingModel.updateRating(rid, rating)
            .then(
                function (comment) {
                    res.send(comment);
                },
                function (e) {
                    res.send(e);
                });
    }


    /**
     * creates new rating.
     * @param req
     * request
     * @param res
     * response
     * @returns {*}
     * user object
     */
    function createRating(req, res) {
        var pid = req.params.pid;
        var uid = req.params.uid;
        var rating = req.body;
        model.ratingModel.createRating(rating, pid, uid)
            .then(function (rating) {
                res.send(rating);

            }, function (e) {
                res.send(e);
            });
    }


    /**
     * method to delete rating.
     * @param req
     * request
     * @param res
     * response
     */
    function deleteRating(req, res) {
        var rid = req.params.rid;
        model.ratingModel.deleteRating(rid)
            .then(
                function (s) {
                    res.sendStatus(200);
                },
                function (e) {
                    res.sendStatus(400).send(e);
                });
    }

};