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
     * @param SearchService
     * serach service
     * @constructor
     */
    function AdminController($location, $route ,SearchService) {
        var vm = this;
        function init(){
        }
        init();


    }

})();