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


        function getUsers(query) {
            return $http.get('/api/users', query);
        }
        function getComments() {
            return $http.get('/api/comments', query);
        }
        
        function deleteComment(id) {
            return $http.delete('/api/comment', id);
        }

        function deleteUser(id) {
            return $http.delete('/api/user', id);
        }
    }
})();
