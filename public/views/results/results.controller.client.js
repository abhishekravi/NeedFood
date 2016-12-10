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
    function ResultsController($location, $routeParams, UserService, SearchService) {
        var vm = this;
        vm.results = [];
        vm.querySearch = querySearch;
        vm.nextPage = nextPage;
        vm.getDetails = getDetails;
        vm.querySelected = querySelected;
        vm.pageNums = [];
        var numOfPages = 0;
        var itemsPerPage = 10;
        var page = $routeParams["page"];

        function init() {
            if (page) {
                vm.query = {
                    'text': $routeParams["query"],
                    'location': $routeParams["location"],
                    'offset': (parseInt(page) - 1) * 10
                };
            } else
                vm.query = {'text': $routeParams["query"],'location': $routeParams["location"]};
            search();
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
                    vm.pageNums = [];
                    vm.results = result.data;
                    vm.query = result.data.query;
                    numOfPages = vm.results.total / itemsPerPage;
                    console.log('total:' + vm.results.total);
                    console.log('num of pages:' + numOfPages);
                    for (var i = 0; i < numOfPages; i++)
                        vm.pageNums[i] = i + 1;
                }, function (error) {
                    vm.result = error;
                    //$route.reload();
                });
        }

        function querySearch() {
            $location.url('/results/' + $routeParams["location"] + '/' + vm.query.text);
        }

        function querySelected() {
            $location.url("/results/" + vm.query.location + '/' + vm.selected);
        }

        /**
         * method to perform query search with offset
         * @param offset
         * offset
         * @returns {*|Object|Number}
         * result object
         */
        function nextPage(offset) {
            $location.url('/results/' + $routeParams["location"] + '/' + vm.query.text + '/' + offset);
        }

        function getDetails(place) {
            UserService.back.push('results/' + vm.query.location + '/' + vm.query.text + '/' + ($routeParams["page"] ? $routeParams["page"] : 1));
            $location.url('/details/'
                + vm.query.location
                + '/'
                + vm.query.text
                + '/'
                + ($routeParams["page"] ? $routeParams["page"] : 1)
                + '/'
                + place.id);
        }

    }

})();