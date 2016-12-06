/**
 * search service.
 */
(function () {
    angular
        .module("MyProject")
        .factory("SearchService", SearchService);

    function SearchService($http) {
        var api = {
            "searchQuery": searchQuery,
            results: ''
        };
        return api;


        function searchQuery(query) {
            return $http.post('/api/search', query);
        }
    }
})();
