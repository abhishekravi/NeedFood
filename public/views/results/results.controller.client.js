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
        vm.nextPage = nextPage;
        vm.getDetails = getDetails;
        vm.pageNums = [];
        var numOfPages = 0;
        var itemsPerPage = 10;
        function init(){
            vm.pageNums = [];
            vm.results = SearchService.results.data;
            if(SearchService.results.data) {
                vm.query = SearchService.results.data.query;
                SearchService.results = '';
                numOfPages = vm.results.total / itemsPerPage;
                console.log('total:' + vm.results.total);
                console.log('num of pages:' + numOfPages);
                for (var i = 0; i < numOfPages; i++)
                    vm.pageNums[i] = i + 1;
            } else if(SearchService.query != ''){
                vm.query = SearchService.query;
                SearchService.query = '';
                vm.search();
            }

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
                    vm.pageNums= [];
                    vm.results = result.data;
                    vm.query = result.data.query;
                    numOfPages = vm.results.total / itemsPerPage;
                    console.log('total:' + vm.results.total);
                    console.log('num of pages:' + numOfPages);
                    for(var i=0;i<numOfPages;i++)
                        vm.pageNums[i] = i + 1;
                },function (error) {
                    vm.result = error;
                    $route.reload();
                });
        }

        /**
         * method to perform query search with offset
         * @param offset
         * offset
         * @returns {*|Object|Number}
         * result object
         */
        function nextPage(offset) {
            vm.query['offset'] = (offset-1) * 10;
            search();
        }
        
        function getDetails(place) {
            place.image_url = place.image_url.replace('ms.jpg', 'o.jpg');
            SearchService.place = place;
            SearchService.query = vm.query;
            $location.url('/details');
        }

    }

})();