/**
 * login controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("NavBarController", NavBarController);

    /**
     * contains navbar controller methods.
     * @param $location
     * for redirecting
     * @param UserService
     * user services
     * @constructor
     */
    function NavBarController($location, $route, UserService, $window) {
        var vm = this;
        vm.isLoggedIn = false;
        vm.logout = logout;
        vm.goBack = goBack;
        vm.isNotHome = isNotHome;
        vm.back = UserService.back.pop();

        /**
         * to initialize navbar.
         */
        function init() {
            UserService.checkLogin()
                .then(function (user) {
                    if(user.data == '0')
                        vm.isLoggedIn = false;
                    else {
                        vm.user = user;
                        vm.isLoggedIn = true;
                    }
                });
        }
        init();

        /**
         * to logout
         */
        function logout(){
            UserService.logout()
                .then(function () {
                    if($location.path() == "/" || $location.path() == "/home")
                        $route.reload();
                    else
                        $location.url("/");
                });
        }

        /**
         * to go back
         */
        function goBack() {
            $window.history.back();
        }

        /**
         * check in in home page
         * @returns {boolean}
         */
        function isNotHome() {
            return $location.path() != '/';
        }
    }

})();