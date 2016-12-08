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
            getComments: getComments
        };
        return api;


        function createComment(place, comment) {
            return $http.post('/api/comment', {place : place, comment: comment});
        }

        function updateComment(cid, comment) {
            return $http.put('/api/comment/' + cid, comment);
        }

        function getComments(pid) {
            return $http.get('/api/' + pid + '/comments');
        }

        function deleteComment(cid) {
            return $http.delete('/api/comment/' + cid);
        }

    }
})();
