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

        /**
         * to perform yelp query search
         * @param query
         * @returns {*}
         */
        function searchQuery(query) {
            return $http.post('/api/search', query);
        }

        /**
         * to perform yelp business search
         * @param query
         * @returns {*}
         */
        function searchBusiness(query) {
            return $http.post('/api/search/place', {text: query});
        }


    }
})();
