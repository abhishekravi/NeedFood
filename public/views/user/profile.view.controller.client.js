/**
 * profile controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("ProfileViewController", ProfileViewController);

    /**
     * contains profile controller methods.
     * @param $routeParams
     * get route parameters
     * @param UserService
     * user sevice
     * @constructor
     */
    function ProfileViewController($location, $routeParams, UserService, CrudService,RatingService ) {
        var vm = this;
        vm.setRating = setRating;
        vm.viewPlace = viewPlace;

        /**
         * to initializr profile page.
         */
        function init() {
            var uid = $routeParams['uid'];
            var ret = UserService.findUserById(uid);
            ret
                .success(function(user){
                    vm.user = user;
                    CrudService.getUserComments(user._id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                            getRating();
                        });
                })
                .error(function(e){
                    console.log(e);
                });
        }
        init();

        /**
         * get rating for user comments.
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
         * setting rating in comment object
         * @param ratings
         */
        function setCommentRatings(ratings) {
            vm.ratings = {};
            for(r in ratings){
                vm.ratings[ratings[r].user + ratings[r].yelpid] = ratings[r].value;
            }
        }

        /**
         * set rating in ui
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
         * view the details page
         * @param yelpid
         */
        function viewPlace(yelpid) {
            UserService.back.push('user/' + $routeParams['uid']);
            $location.url('/details/' + $routeParams['uid'] + '/'+ yelpid);
        }

    }

})();