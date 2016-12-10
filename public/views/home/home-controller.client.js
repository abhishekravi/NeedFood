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
    function HomeController($location, $routeParams, UserService, CrudService, $scope) {
        var vm = this;
        vm.search = search;
        vm.querySelected = querySelected;
        vm.getRating = getRating;
        vm.viewPlace = viewPlace;
        vm.viewProfile = viewProfile;
        vm.query = {
            text: '',
            location: ''
        };

        function init() {
            UserService.back = [];
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            function success(pos) {
                UserService.location = pos.coords;
                vm.location = pos.coords;
                codeLatLng(vm.location.latitude, vm.location.longitude);
            };

            function error(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            };
            navigator.geolocation.getCurrentPosition(success, error, options);
            getLatestComments();
        }


        function codeLatLng(lat, lng) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        //formatted address
                        //alert(results[0].formatted_address)
                        //find country name
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                                //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                                if (results[0].address_components[i].types[b] == "locality") {
                                    //this is the object you are looking for
                                    vm.query.location= results[0].address_components[i].long_name;
                                    $scope.$digest();
                                    break;
                                }
                            }
                        }
                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
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
            UserService.back.push('');
            $location.url("/results/" + vm.query.location + '/' + vm.query.text);
        }

        function querySelected() {
            UserService.back.push('');
            $location.url("/results/" + vm.query.location + '/' + vm.selected);
        }

        function getLatestComments() {
            CrudService.getLatestComments()
                .then(function (comments) {
                    vm.comments = comments.data;
                },function (e) {
                    console.log(e.data);
                })
        }

        function getRating(rating) {
            var arr = ['notfilled','notfilled','notfilled','notfilled','notfilled'];
            for(var i=0;i<rating;i++){
                arr[i] = 'filled';
            }
            return arr;
        }

        function viewPlace(yelpid) {
            UserService.back.push('user/' + $routeParams['uid']);
            $location.url('/details/' + yelpid);
        }

        function viewProfile(uid) {
            if (vm.user != '0') {
                UserService.back.push('details/' + vm.location + '/' + vm.query + '/' + vm.page + '/' + vm.pid);
                $location.url("/user/" + uid);
            }
        }

    }

})();