/**
 * search service.
 */
(function () {
    angular
        .module("MyProject")
        .factory("RatingService", RatingService);

    function RatingService($http) {
        var api = {
            createRating: createRating,
            updateRating: updateRating,
            deleteRating: deleteRating,
            getRating: getRating,
            getRatingsForUser: getRatingsForUser,
            getRatingsForUser: getRatingsForUsers
        };
        return api;

        /**
         * create rating.
         * @param uid
         * @param pid
         * @param rating
         * @returns {*}
         */
        function createRating(uid, pid, rating) {
            return $http.post('/api/rating/' + uid + '/' + pid, rating);
        }

        /**
         * update rating
         * @param rid
         * @param rating
         * @returns {*}
         */
        function updateRating(rid, rating) {
            return $http.put('/api/rating/' + rid, rating);
        }

        /**
         * get rating
         * @param uid
         * @param pid
         * @returns {*}
         */
        function getRating(uid, pid) {
            return $http.get('/api/rating/' + uid + '/' + pid);
        }

        /**
         * delete rating
         * @param rid
         * @returns {*}
         */
        function deleteRating(rid) {
            return $http.delete('/api/rating/' + rid);
        }

        /**
         * get ratings for a user
         * @param uid
         * @returns {*}
         */
        function getRatingsForUser(uid) {
            return $http.get('/api/rating/' + uid);
        }

        /**
         * get rating for multiple users
         * @param users
         * @returns {*}
         */
        function getRatingsForUsers(users) {
            return $http.post('/api/rating', users);
        }
    }
})();
