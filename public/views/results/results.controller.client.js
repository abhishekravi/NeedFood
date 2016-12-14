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
        vm.getAddress = getAddress;
        vm.getCuisine = getCuisine;
        vm.pageNums = [];
        var numOfPages = 0;
        var itemsPerPage = 10;
        var page = $routeParams["page"];

        /**
         * perform on page load.
         */
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
            var input = $('#city')[0];
            var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
            google.maps.event.addListener(autocomplete, 'place_changed', function(){
                var place = autocomplete.getPlace();
            });
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
                    for (var i = 0; i < numOfPages; i++)
                        vm.pageNums[i] = i + 1;
                }, function (error) {
                    vm.result = error;
                    //$route.reload();
                });
        }

        /**
         * on search button click
         */
        function querySearch() {
            if($('#city').val() && $('#city').val() != '')
                vm.query.location = $('#city').val().split(',')[0];
            $location.url('/results/' + $routeParams["location"] + '/' + vm.query.text);
        }

        /**
         * on quick query select.
         */
        function querySelected() {
            if($('#city').val() && $('#city').val() != '')
                vm.query.location = $('#city').val().split(',')[0];
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

        /**
         * to go to get details page.
         * @param place
         */
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

        /**
         * get address from yelp response
         * @param addr
         * @returns {string}
         */
        function getAddress(addr) {
            var address = '';
            for(a in addr){
                address = address + addr[a];
            }
            return address;
        }

        /**
         * get cuisine from yelp response
         * @param cs
         * @returns {string}
         */
        function getCuisine(cs) {
            var cuisine = '';
            for(c in cs){
                cuisine = cuisine + cs[c];
            }
            return cuisine;
        }

    }

})();