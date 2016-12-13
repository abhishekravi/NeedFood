/**
 * profile controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("ProfileController", ProfileController);

    /**
     * contains profile controller methods.
     * @param $routeParams
     * get route parameters
     * @param UserService
     * user sevice
     * @constructor
     */
    function ProfileController($routeParams, $location, UserService,CrudService, RatingService ) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.setRating = setRating;
        vm.viewProfile = viewProfile;
        vm.viewPlace = viewPlace;

        /**
         * to initializr profile page.
         */
        function init() {
            var ret = UserService.findCurrentUser();
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
         * get rating for top comments.
         */
        function getRating() {
            var users = [];
            for (c in vm.comments) {
                users.push(vm.comments[c].user);
            }
            RatingService.getRatingsForUser(users)
                .then(function (ratings) {
                    setCommentRatings(ratings.data);
                },function (e) {
                    console.log(e);
                });
        }

        /**
         * set rating in comment objects
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
         * to go to details page
         * @param yelpid
         */
        function viewPlace(yelpid) {
            UserService.back.push('user/' + $routeParams['uid']);
            $location.url('/details/' + $routeParams['uid'] + '/'+ yelpid);
        }

        /**
         * method to update user.
         */
        function updateUser(){
            UserService.updateUser(vm.user)
                .then(function () {
                    $('#profileMessage').removeClass('hidden');
                    vm.message = "Updated!"
                }, function (error) {
                    vm.message("Update Failed!");
                    console.log(error);
                });
        }

        /**
         * method to delete the user.
         */
        function deleteUser(){
            UserService.deleteUser(vm.user._id)
                .success(function(){
                    $location.url("/login");
                })
                .error(function(e){
                    console.log(e);
                });

        }

        /**
         * to view profile.
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