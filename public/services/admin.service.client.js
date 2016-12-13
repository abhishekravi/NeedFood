/**
 * search service.
 */
(function () {
    angular
        .module("MyProject")
        .factory("AdminService", AdminService);

    function AdminService($http) {
        var api = {
            getUsers: getUsers,
            getComments: getComments,
            deleteUser: deleteUser,
            deleteComment: deleteComment
        };
        return api;


        /**
         * method to get users.
         * @param query
         * @returns {*}
         */
        function getUsers(query) {
            return $http.get('/api/users', query);
        }

        /**
         * method to get comments.
         * @param uid
         * user id
         * @returns {*}
         */
        function getComments(uid) {
            return $http.get('/api/' + uid + '/allcomments');
        }

        /**
         * method to delete comment.
         * @param cid
         * comment id
         * @returns {*}
         */
        function deleteComment(cid) {
            return $http.delete('/api/comment/' + cid);
        }

        /**
         * method to delete user.
         * @param id
         * user id
         * @returns {*}
         */
        function deleteUser(id) {
            return $http.delete('/api/user/' + id);
        }
    }
})();
