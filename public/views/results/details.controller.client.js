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
    function DetailsController($location, $route ,SearchService, UserService, CrudService) {

        var vm = this;
        vm.notLoggedIn = false;

        vm.saveComment = saveComment;
        vm.updateComment = updateComment;
        vm.deleteComment = deleteComment;
        vm.saveRating = saveRating;
        vm.stars = ['notfilled','notfilled','notfilled','notfilled','notfilled'];

        UserService.back = 'results';
        function init(){
            UserService.checkLogin()
                .then(function (user) {
                    if(user.data == '0')
                        vm.notLoggedIn = true;
                    else {
                        //if logged in get comments
                        vm.notLoggedIn = false;
                        $('#comment-btn').title = "";
                    }
                    vm.place = SearchService.place;
                    //get all comments for this place
                    CrudService.getComments(SearchService.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                            if(comments && vm.comments.length > 0){
                                //if user is logged in get their comment.
                                if(user.data != '0') {
                                    for (c in vm.comments) {
                                        if (vm.comments[c].user == user.data._id) {
                                            vm.comment = vm.comments[c];
                                            if(vm.comment.rating)
                                                setRating(vm.comment.rating);
                                        }
                                    }
                                }
                            }
                        });
                    SearchService.place = '';
                    console.log(vm.comment);
                });

        }
        init();

        function setRating(rating){
            vm.stars = ['notfilled','notfilled','notfilled','notfilled','notfilled'];
            for(var i=0;i<rating;i++){
                vm.stars[i] = 'filled';
            }
        }
        
        function saveRating(rating) {
            setRating(rating);
            vm.comment.rating = rating;
            if(vm.comment._id)
                updateComment();
            else {
                saveComment();
            }
        }

        function saveComment() {
            if(!vm.comment.rating)
                vm.comment.rating = 0;
            CrudService.createComment(vm.place, vm.comment)
                .then(function (comment) {
                    vm.comment = comment.data;
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            console.log(comments.data);
                            vm.comments = comments.data;
                        });
                    console.log('comment saved');
                },function (e) {
                    console.log('comment not saved, cause:' + e);
                });
        }

        function updateComment() {
            CrudService.updateComment(vm.comment._id, vm.comment)
                .then(function (comment) {
                    setRating(vm.comment.rating);
                    console.log(comment);
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                    console.log('comment updated');
                },function (e) {
                    console.log('comment not updated, cause:' + e);
                });
        }

        function deleteComment() {
            vm.comment.text = '';
            updateComment();
        }


    }

})();