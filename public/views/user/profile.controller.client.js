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
    function ProfileController($routeParams, $location, UserService,CrudService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.getRating = getRating;
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
    }

})();