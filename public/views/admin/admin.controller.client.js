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

        function getUsers(){
            AdminService.getUsers()
                .then(function (users) {
                    vm.users = users.data;
                });

        }
        function deleteUser(uid) {
            AdminService.deleteUser(uid)
                .then(function () {
                    getUsers();
                    console.log('user deleted');
                },function (e) {
                    console.log('user not deleted');
            });
        }

        function deleteComment(cid,comment, uid) {
            comment.text = '';
            AdminService.clearComment(cid, comment)
                .then(function () {
                    getComments(uid);
                });
        }

        function getComments(uid) {
            AdminService.getComments(uid)
                .then(function (comments) {
                    console.log(comments);
                    vm.comments = comments.data;
                });
        }
    }

})();