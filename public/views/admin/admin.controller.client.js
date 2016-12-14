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
        vm.getComments = getComments;
        vm.deleteComment = deleteComment;
        function init(){
        }
        init();

        /**
         * get all users
         */
        function getUsers(){
            AdminService.getUsers()
                .then(function (users) {
                    vm.users = users.data;
                });

        }

        /**
         * delete user.
         * @param uid
         */
        function deleteUser(uid) {
            AdminService.deleteUser(uid)
                .then(function () {
                    getUsers();
                },function (e) {
                    console.log('user not deleted');
            });
        }

        /**
         * delete comment.
         * @param cid
         * @param comment
         * @param uid
         */
        function deleteComment(cid,comment, uid) {
            AdminService.deleteComment(cid)
                .then(function () {
                    getComments(uid);
                });
        }

        /**
         * get user comments.
         * @param uid
         */
        function getComments(uid) {
            AdminService.getComments(uid)
                .then(function (comments) {
                    console.log(comments);
                    vm.comments = comments.data;
                });
        }
    }

})();