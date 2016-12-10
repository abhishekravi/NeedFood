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
    function ProfileViewController($location, $routeParams, UserService, CrudService) {
        var vm = this;
        vm.getRating = getRating;
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
                        });
                })
                .error(function(e){
                    console.log(e);
                });
        }
        init();

        function getRating(rating) {
            var arr = ['notfilled','notfilled','notfilled','notfilled','notfilled'];
            for(var i=0;i<rating;i++){
                arr[i] = 'filled';
            }
            return arr;
        }
        
        function viewPlace(yelpid) {
            UserService.back.push('user/' + $routeParams['uid']);
            $location.url('/details/' + $routeParams['uid'] + '/'+ yelpid);
        }
    }

})();