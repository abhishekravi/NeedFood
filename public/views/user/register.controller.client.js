/**
 * register controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("RegisterController", RegisterController);

    /**
     * contains register controller methods.
     * @param $location
     * for redirection
     * @param UserService
     * user service
     * @constructor
     */
    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        /**
         * mehtod to register new user.
         * @param user
         * user object
         */
        function register(user) {
            user = UserService.createUser(user);
            $location.url("/user");
        }
    }

})();