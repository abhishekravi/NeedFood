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
    function HomeController($location, $routeParams, UserService, CrudService, $scope, RatingService) {
        var vm = this;
        vm.search = search;
        vm.querySelected = querySelected;
        vm.setRating = setRating;
        vm.viewPlace = viewPlace;
        vm.viewProfile = viewProfile;
        vm.query = {
            text: '',
            location: ''
        };

        /**
         * method to call when loading page.
         */
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

            //this is for the autocomplete feature.
            var input = $('#city')[0];
            var autocomplete = new google.maps.places.Autocomplete(input, {types: ['(cities)']});
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();

            });
        }


        /**
         * method to get city according to user's geo location.
         * @param lat
         * @param lng
         */
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
                                    vm.query.location = results[0].address_components[i].long_name;
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
            if ($('#city').val() && $('#city').val() != '')
                vm.query.location = $('#city').val().split(',')[0];
            UserService.back.push('');
            $location.url("/results/" + vm.query.location + '/' + vm.query.text);
        }

        /**
         * perform search of quick query.
         */
        function querySelected() {
            if ($('#city').val() && $('#city').val() != '')
                vm.query.location = $('#city').val().split(',')[0];
            UserService.back.push('');
            $location.url("/results/" + vm.query.location + '/' + vm.selected);
        }

        /**
         * method to fetch all latest comments
         */
        function getLatestComments() {
            CrudService.getLatestComments()
                .then(function (comments) {
                    vm.comments = comments.data;
                    getRating();
                }, function (e) {
                    console.log(e.data);
                })
        }

        /**
         * method do get all ratings.
         */
        function getRating() {
            var users = [];
            for (c in vm.comments) {
                users.push(vm.comments[c].user);
            }
            RatingService.getRatingsForUser(users)
                .then(function (ratings) {
                    setCommentRatings(ratings.data);
                    console.log('got ratings');
                },function (e) {
                    console.log(e);
                });
        }

        /**
         * method to set rating to comment object
         * @param ratings
         */
        function setCommentRatings(ratings) {
            vm.ratings = {};
            for(r in ratings){
                vm.ratings[ratings[r].user + ratings[r].yelpid] = ratings[r].value;
            }
        }

        /**
         * setting rating for display.
         * @param rating
         * @returns {string[]}
         */
        function setRating(rating) {
            var arr = ['notfilled', 'notfilled', 'notfilled', 'notfilled', 'notfilled'];
            for (var i = 0; i < rating; i++) {
                arr[i] = 'filled';
            }
            return arr;
        }

        /**
         * to go to place's details page.
         * @param yelpid
         */
        function viewPlace(yelpid) {
            UserService.back.push('user/' + $routeParams['uid']);
            $location.url('/details/' + yelpid);
        }

        /**
         * to view user profile.
         * @param uid
         */
        function viewProfile(uid) {
            if (vm.user != '0') {
                UserService.back.push('details/' + vm.location + '/' + vm.query + '/' + vm.page + '/' + vm.pid);
                $location.url("/user/" + uid);
            }
        }

    }

})();