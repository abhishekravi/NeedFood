/**
 * user view service.
 */
(function () {
    angular
        .module("MyProject")
        .factory("UserService", UserService);

    /**
     * contains all user view service methods.
     * @returns {{createUser: createUser, findUserById: findUserById, findUserByUsername: findUserByUsername, findUserByCredentials: findUserByCredentials, updateUser: updateUser, deleteUser: deleteUser}}
     * @constructor
     */
    function UserService($http) {
        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "login" : login,
            checkLogin: checkLogin,
            logout: logout,
            findCurrentUser: findCurrentUser
        };
        return api;

        function login(username, password){
            var user = {username:username, password: password};
            return $http.post('/api/login',user);
        }

        function checkLogin(){
            return $http.post('/api/checkLogin');
        }
        
        function logout() {
            return $http.post('/api/logout');
        }
        /**
         * creates new user.
         * @param user
         * user object
         * @returns
         * response
         */
        function createUser(user) {
           return $http.post('/api/register',user);
        }

        /**
         * method to find user by userid.
         * @param userId
         * user id
         * @returns
         * response
         */
        function findUserById(userId) {
            var url = '/api/user/' + userId;
            return $http.get(url);
        }

        function findCurrentUser(){
            var url = '/api/user';
            return $http.get(url);
        }

        /**
         * method to find user by username.
         * @param username
         * user name
         * @returns
         * response
         */
        function findUserByUsername(username) {
            var url = '/api/user?username='+username;
            return $http.get(url);
        }

        /**
         * method to find user by username and password.
         * @param username
         * username
         * @param password
         * password
         * @returns
         * response
         */
        function findUserByCredentials(username, password) {
            var url = '/api/user?username='+username+'&password='+password;
            return $http.get(url);
        }

        /**
         * method to update user.
         * @param user
         * user object
         */
        function updateUser(user) {
            return $http.put('/api/user/'+user._id, user);
        }

        /**
         * method to delete user.
         * @param uid
         * user id
         */
        function deleteUser(uid) {
            return $http.delete('/api/user/'+uid);
        }
    }
})();
