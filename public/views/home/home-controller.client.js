/**
 * Home controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("HomeController", HomeController);

    /**
     * contains home controller methods.
     * @param $location
     * for redirection
     * @param SearchService
     * serach service
     * @constructor
     */
    function HomeController($location, SearchService, UserService) {
        var vm = this;
        vm.search = search;



        function init(){
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
                .then(function (results) {
                    SearchService.results = results;
                    $location.url("/results");
                },function (error) {
                    vm.result = error;
                });
        }

    }

})();