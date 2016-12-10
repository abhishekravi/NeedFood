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
    function DetailsController($location, $routeParams, SearchService, UserService, CrudService) {

        var vm = this;
        vm.notLoggedIn = false;
        vm.saveComment = saveComment;
        vm.updateComment = updateComment;
        vm.deleteComment = deleteComment;
        vm.saveRating = saveRating;
        vm.viewProfile = viewProfile;
        vm.openReply = openReply;
        vm.saveReply = saveReply;
        vm.editReply = editReply;
        vm.updateReply = updateReply;
        vm.deleteReply = deleteReply;
        vm.editComment = editComment;
        vm.stars = ['notfilled', 'notfilled', 'notfilled', 'notfilled', 'notfilled'];


        function init() {
            vm.query = $routeParams['query'];
            vm.page = $routeParams['page'];
            vm.pid = $routeParams['pid'];
            vm.location = $routeParams['location'];
            getDetails()
                .then(function (place) {
                    initMap(place.data.location);
                    UserService.checkLogin()
                        .then(function (user) {
                            vm.user = user.data;
                            if (user.data == '0')
                                vm.notLoggedIn = true;
                            else {
                                //if logged in get comments
                                vm.notLoggedIn = false;
                                $('#comment-btn').title = "";
                            }
                            vm.place = place.data;
                            vm.place.image_url = vm.place.image_url.replace('ms.jpg', 'o.jpg');
                            //get all comments for this place
                            CrudService.getComments(vm.pid)
                                .then(function (comments) {
                                    vm.comments = comments.data;
                                    if (comments && vm.comments.length > 0) {
                                        //if user is logged in get their comment.
                                        if (user.data != '0') {
                                            for (c in vm.comments) {
                                                if (vm.comments[c].user == user.data._id) {
                                                    vm.comment = vm.comments[c];
                                                    if (vm.comment.rating)
                                                        setRating(vm.comment.rating);
                                                }
                                            }
                                        }
                                    }
                                });
                            console.log(vm.comment);
                        });

                });
        }

        init();

        function getDetails() {
            return SearchService.searchBusiness(vm.pid);
        }

        function setRating(rating) {
            vm.stars = ['notfilled', 'notfilled', 'notfilled', 'notfilled', 'notfilled'];
            for (var i = 0; i < rating; i++) {
                vm.stars[i] = 'filled';
            }
        }

        function saveRating(rating) {
            if (vm.user != '0') {
                setRating(rating);
                vm.comment.rating = rating;
                if (vm.comment._id)
                    updateComment();
                else {
                    saveComment();
                }
            }
        }

        function saveComment() {
            if (!vm.comment.rating)
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
                }, function (e) {
                    console.log('comment not saved, cause:' + e.data);
                });
        }

        function updateComment() {
            $('#edit-comment-btn').removeClass('hidden');
            $('#updt-comment-btn').addClass('hidden');
            $('#comment-edit').addClass('hidden');
            $('#disp-comment').removeClass('hidden');
            CrudService.updateComment(vm.comment._id, vm.comment)
                .then(function (comment) {
                    setRating(vm.comment.rating);
                    console.log(comment);
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                    console.log('comment updated');
                }, function (e) {
                    console.log('comment not updated, cause:' + e.data);
                });
        }

        function saveReply(cid) {
            $('#opn-reply' + cid).removeClass('hidden');
            $('#reply-inp' + cid).addClass('hidden');
            $('#reply-comment-btn' + cid).addClass('hidden');
            var reply = {
                text: vm.reply,
                user: vm.user._id,
                username: vm.user.username
            };
            CrudService.saveReply(cid,reply)
                .then(function () {
                    console.log('reply saved');
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                },function (e) {
                    console.log('reply not saved:' + e.data);
                });
        }

        function editReply(rid) {
            $('#reply-edit' + rid).addClass('hidden');
            $('#reply-text' + rid).addClass('hidden');
            $('#reply-save' + rid).removeClass('hidden');
            $('#reply-upd' + rid).removeClass('hidden');
        }

        function updateReply(cid, rid, reply) {
            $('#reply-edit' + rid).removeClass('hidden');
            $('#reply-text' + rid).removeClass('hidden');
            $('#reply-save' + rid).addClass('hidden');
            $('#reply-upd' + rid).addClass('hidden');
            CrudService.updateReply(cid,rid,reply)
                .then(function () {
                    console.log('reply updated');
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                },function (e) {
                    console.log('reply not updated:' + e.data);
                });
        }
        
        function deleteReply(cid, rid) {
            CrudService.deleteReply(cid,rid)
                .then(function () {
                    console.log('reply deleted');
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                },function (e) {
                    console.log('reply not deleted:' + e.data);
                });
            
        }

        function deleteComment() {
            vm.comment.text = '';
            updateComment();
        }

        function viewProfile(uid) {
            if (vm.user != '0') {
                UserService.back.push('details/' + vm.location + '/' + vm.query + '/' + vm.page + '/' + vm.pid);
                $location.url("/user/" + uid);
            }
        }

        function editComment() {
            $('#edit-comment-btn').addClass('hidden');
            $('#updt-comment-btn').removeClass('hidden');
            $('#comment-edit').removeClass('hidden');
            $('#disp-comment').addClass('hidden');
        }

        function openReply(id) {
            $('#opn-reply' + id).addClass('hidden');
            $('#reply-inp' + id).removeClass('hidden');
            $('#reply-comment-btn' + id).removeClass('hidden');
        }

        function initMap(location) {
            var lat = location.coordinate.latitude;
            var long = location.coordinate.longitude;
            var location = UserService.location;
            console.log('init map called');
            var mapCanvas = $('#map')[0];
            var mapOptions = {
                center: new google.maps.LatLng(lat, long),
                zoom: 15
            };
            vm.map = new google.maps.Map(mapCanvas, mapOptions);
            plotLocation(lat,long);
        }

        /**
         * method to perform query search
         * @param query
         * query
         * @returns {*|Object|Number}
         * result object
         */
        function plotLocation(lat, long) {
            vm.map.setCenter({lat: lat, lng: long});
            var marker = new google.maps.Marker({
                position: {lat: lat, lng: long},
                map: vm.map
            });
        }

    }

})();