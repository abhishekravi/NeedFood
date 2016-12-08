/**
 * Home controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("AdminController", AdminController);

    /**
     * contains home controller methods.
     * @param $location
     * for redirection
     * @param UserService
     * user service
     * @constructor
     */
    function AdminController($location, $route ,AdminService) {
        var vm = this;
        vm.getUsers = getUsers;
        vm.deleteUser = deleteUser;
        vm.deleteComment = deleteComment;
        vm.deletePlace = deletePlace;
        function init(){
        }
        init();

        function getUsers(){
            AdminService.getUsers()
                .then(function (users) {
                    vm.users = users.data;
                });

        }
        function deleteUser() {

        }

        function deleteComment() {

        }

        function deletePlace() {

        }
    }

})();