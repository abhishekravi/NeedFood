(function () {
    angular
        .module("MyProject", ['ngRoute'])
        .config(Config);
    function Config($routeProvider) {
        $routeProvider

            .when("/", {
                templateUrl: "/views/home/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/details/:location/:query/:page/:pid", {
                templateUrl: "/views/results/details.view.client.html",
                controller: "DetailsController",
                controllerAs: "model"
            })
            .when("/details/:uid/:pid", {
                templateUrl: "/views/results/details.view.client.html",
                controller: "DetailsController",
                controllerAs: "model"
            })
            .when("/details/:pid", {
                templateUrl: "/views/results/details.view.client.html",
                controller: "DetailsController",
                controllerAs: "model"
            })
            .when("/admin", {
                templateUrl: "/views/admin/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkAdmin
                }
            })
            .when("/user", {
                templateUrl: "/views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid", {
                templateUrl: "/views/user/profile.public.view.client.html",
                controller: "ProfileViewController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/results/:location/:query", {
                templateUrl: "/views/results/results.view.client.html",
                controller: "ResultsController",
                controllerAs: "model"
            })
            .when("/results/:location/:query/:page", {
                templateUrl: "/views/results/results.view.client.html",
                controller: "ResultsController",
                controllerAs: "model"
            })
            .otherwise({redirectTo: '/'})
    }

    function checkLogin($q, UserService, $location) {
        var deferred = $q.defer();
        UserService.checkLogin()
            .success(function (user) {
                if (user != '0')
                    deferred.resolve();
                else {
                    deferred.reject();
                    $location.url("/");
                }
            });
        return deferred.promise;
    }
    
    function checkAdmin($q, UserService, $location) {
        var deferred = $q.defer();
        UserService.checkAdmin()
            .success(function (user) {
                if (user != '0')
                    deferred.resolve();
                else {
                    deferred.reject();
                    $location.url("/");
                }
            });
        return deferred.promise;
    }
})();
