/**
 * search service.
 */
(function () {
    angular
        .module("MyProject")
        .factory("SearchService", SearchService);

    function SearchService($http) {
        var api = {
            searchQuery: searchQuery,
            searchBusiness: searchBusiness
        };
        return api;


        function searchQuery(query) {
            return $http.post('/api/search', query);
        }

        function searchBusiness(query) {
            return $http.post('/api/search/place', {text: query});
        }


    }
})();
