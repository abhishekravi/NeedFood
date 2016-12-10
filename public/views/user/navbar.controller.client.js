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
        vm.back = UserService.back.pop();
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

        function logout(){
            UserService.logout()
                .then(function () {
                    if($location.path() == "/" || $location.path() == "/home")
                        $route.reload();
                    else
                        $location.url("/");
                });
        }
        
        function goBack() {
            $window.history.back();
        }
    }

})();