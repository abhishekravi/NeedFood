/**
 * Home controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("ResultsController", ResultsController);

    /**
     * contains home controller methods.
     * @param $location
     * for redirection
     * @param SearchService
     * serach service
     * @constructor
     */
    function ResultsController($location, $route ,SearchService) {
        var vm = this;
        vm.results = [];
        vm.search = search;
        vm.getDetails = getDetails;
        function init(){
            vm.results = SearchService.results;
            SearchService.results = '';
        }
        init();

        /**
         * method to perform query search
         * @param query
         * query
         * @returns {*|Object|Number}
         * result object
         */
        function search() {
            SearchService.searchQuery(vm.query)
                .then(function (result) {
                    vm.results = result.data;
                },function (error) {
                    vm.result = error;
                    $route.reload();
                });
        }
        
        function getDetails() {
            $location.url('/details');
        }

    }

})();