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


        function createComment(place, comment) {
            return $http.post('/api/comment', {place : place, comment: comment});
        }

        function updateComment(cid, comment) {
            return $http.put('/api/comment/' + cid, comment);
        }

        function getComments(pid) {
            return $http.get('/api/' + pid + '/comments');
        }

        function getUserComments(uid) {
            return $http.get('/api/' + uid + '/allcomments');
        }
        
        function getLatestComments() {
            return $http.get('/api/allcomments');
        }

        function deleteComment(cid) {
            return $http.delete('/api/comment/' + cid);
        }

        function saveReply(cid, reply){
            return $http.put('/api/comment/reply/' + cid, reply);
        }

        function updateReply(cid, rid, reply){
            return $http.put('/api/comment/reply/' + cid + '/' + rid, {reply: reply});
        }

        function deleteReply(cid, rid){
            return $http.delete('/api/comment/reply/' + cid + '/' + rid);
        }

    }
})();
