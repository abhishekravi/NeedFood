/**
 * search service.
 */
(function () {
    angular
        .module("MyProject")
        .factory("CrudService", CrudService);

    function CrudService($http) {
        var api = {
            createComment: createComment,
            updateComment: updateComment,
            deleteComment: deleteComment,
            getComments: getComments,
            getLatestComments: getLatestComments,
            getUserComments: getUserComments,
            saveReply: saveReply,
            updateReply: updateReply,
            deleteReply: deleteReply
        };
        return api;


        /**
         * to create comment
         * @param place
         * @param comment
         * @returns {*}
         */
        function createComment(place, comment) {
            return $http.post('/api/comment', {place : place, comment: comment});
        }

        /**
         * to update comment
         * @param cid
         * @param comment
         * @returns {*}
         */
        function updateComment(cid, comment) {
            return $http.put('/api/comment/' + cid, comment);
        }

        /**
         * get comments
         * @param pid
         * @returns {*}
         */
        function getComments(pid) {
            return $http.get('/api/' + pid + '/comments');
        }

        /**
         * get all user comments
         * @param uid
         * @returns {*}
         */
        function getUserComments(uid) {
            return $http.get('/api/' + uid + '/allcomments');
        }

        /**
         * get latest comments
         * @returns {*}
         */
        function getLatestComments() {
            return $http.get('/api/allcomments');
        }

        /**
         * delete comment
         * @param cid
         * @returns {*}
         */
        function deleteComment(cid) {
            return $http.delete('/api/comment/' + cid);
        }

        /**
         * save a reply
         * @param cid
         * @param reply
         * @returns {*}
         */
        function saveReply(cid, reply){
            return $http.put('/api/comment/reply/' + cid, reply);
        }

        /**
         * update a reply
         * @param cid
         * @param rid
         * @param reply
         * @returns {*}
         */
        function updateReply(cid, rid, reply){
            return $http.put('/api/comment/reply/' + cid + '/' + rid, {reply: reply});
        }

        /**
         * delete a reply.
         * @param cid
         * @param rid
         * @returns {*}
         */
        function deleteReply(cid, rid){
            return $http.delete('/api/comment/reply/' + cid + '/' + rid);
        }

    }
})();
