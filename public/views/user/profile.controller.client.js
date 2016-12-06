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
    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        /**
         * to initializr profile page.
         */
        function init() {
            var ret = UserService.findCurrentUser();
            ret
                .success(function(user){
                    vm.user = user;
                })
                .error(function(e){
                    console.log(e);
                });
        }

        init();

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