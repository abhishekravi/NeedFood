
(function() {
    angular
        .module("MyProject", ['ngRoute'])
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/project/views/home/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "/project/views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            }).when("/results", {
            templateUrl: "/project/views/results/results.view.client.html",
            controller: "ResultsController",
            controllerAs: "model"
        })
            .otherwise({redirectTo : '/'})
    }

    function checkLogin($q, UserService, $location) {
        var deferred = $q.defer();
        UserService.checkLogin()
            .success(function (user) {
                if(user != '0')
                    deferred.resolve();
                else {
                    deferred.reject();
                    $location.url("/");
                }
            });
        return deferred.promise;
    }
})();
