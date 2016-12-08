/**
 * Home controller.
 */
(function () {
    angular
        .module("MyProject")
        .controller("DetailsController", DetailsController);

    /**
     * contains home controller methods.
     * @param $location
     * for redirection
     * @param SearchService
     * serach service
     * @constructor
     */
    function DetailsController($location, $route ,SearchService, UserService) {
        var comments = [{user:'jack',text: 'waaaaaaaaa'},{user:'dog',text:'asdadasd'}];

        var vm = this;
        vm.comments = comments;
        vm.notLoggedIn = true;
        vm.saveComment = saveComment;
        UserService.back = 'results';
        function init(){
            vm.place = SearchService.place;
            SearchService.place = '';
        }
        init();

        function saveComment() {
            console.log('save clicked');
        }


    }

})();