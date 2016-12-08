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
            clearComment: clearComment
        };
        return api;


        function getUsers(query) {
            return $http.get('/api/users', query);
        }
        function getComments(uid) {
            return $http.get('/api/' + uid + '/allcomments');
        }
        
        function clearComment(cid, comment) {
            return $http.put('/api/comment/' + cid, comment);
        }

        function deleteUser(id) {
            return $http.delete('/api/user/' + id);
        }
    }
})();
