/**
 * login controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("LoginController", LoginController);

    /**
     * contains login controller methods.
     * @param $location
     * for redirecting
     * @param UserService
     * user services
     * @constructor
     */
    function LoginController($location, $route, UserService) {
        var vm = this;
        vm.login = login;


        /**
         * method to check credentials and login if found.
         * @param user
         * user object
         */
        function login(user) {
            if (user) {
                if (user.username == '' || user.password == '') {
                    $('#loginAlert').removeClass('hidden');
                    vm.alert = "Enter credentials to login";
                } else {
                    $('#loginAlert').addClass('hidden');
                    //var ret = UserService.findUserByCredentials(user.username, user.password);
                    var ret = UserService.login(user.username, user.password);
                    ret
                        .success(function (user) {
                            if (user != '0') {
                                $('#myLogin').modal('hide');
                                $('body').removeClass('modal-open');
                                $('.modal-backdrop').remove();
                                if($location.path() == "/" || $location.path() == "/home")
                                    $route.reload();
                                else
                                    $location.url("/");
                            } else {
                                $('#loginAlert').removeClass('hidden');
                                vm.alert = "Unable to login. Invalid username/password";
                            }
                        })
                        .error(function () {
                            console.log(e);
                        });
                }
            } else {
                $('#loginAlert').removeClass('hidden');
                vm.alert = "Enter credentials to login";
            }
        }
    }

})();