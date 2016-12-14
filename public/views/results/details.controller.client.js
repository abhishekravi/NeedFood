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
    function DetailsController($location, $routeParams, SearchService, UserService, CrudService, RatingService) {

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
        vm.getAddress = getAddress;
        vm.getCuisine = getCuisine;
        vm.stars = ['notfilled', 'notfilled', 'notfilled', 'notfilled', 'notfilled'];


        /**
         * to be called on page load.
         */
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
                            if (user.data != '0') {
                                RatingService.getRating(vm.user._id, vm.place.id)
                                    .then(function (rating) {
                                        if(rating.data) {
                                            vm.rating = rating.data;
                                            setRating(vm.rating.value);
                                        }
                                    });
                            }
                            CrudService.getComments(vm.pid)
                                .then(function (comments) {
                                    vm.comments = comments.data;
                                    if (comments && vm.comments.length > 0) {
                                        //if user is logged in get their comment.
                                        if (user.data != '0') {
                                            for (c in vm.comments) {
                                                if (vm.comments[c].user == user.data._id) {
                                                    vm.comment = vm.comments[c];
                                                }
                                            }
                                        }
                                    }
                                });
                        });

                });
        }

        init();

        /**
         * this will perform the yelp call.
         * @returns {*}
         */
        function getDetails() {
            return SearchService.searchBusiness(vm.pid);
        }

        /**
         * set rating in ui.
         * @param rating
         */
        function setRating(rating) {
            vm.stars = ['notfilled', 'notfilled', 'notfilled', 'notfilled', 'notfilled'];
            for (var i = 0; i < rating; i++) {
                vm.stars[i] = 'filled';
            }
        }

        /**
         * save or update ratings.
         * @param rating
         */
        function saveRating(rating) {
            if (vm.user != '0') {
                setRating(rating);
                if (vm.rating) {
                    vm.rating.value = rating;
                    updateRating();
                }
                else {
                    vm.rating = {value:rating};
                    createRating();
                }
            }
        }

        /**
         * creating new rating.
         */
        function createRating() {
            RatingService.createRating(vm.user._id, vm.place.id, vm.rating)
                .then(function (rating) {
                    vm.rating = rating.data;
                },function (e) {
                    console.log('rating not saved ' + e.data);
                });
        }

        /**
         * update rating
         */
        function updateRating() {
            RatingService.updateRating(vm.rating._id, vm.rating)
                .then(function (rating) {
                    vm.rating = rating.data;
                },function (e) {
                    console.log('rating not updated ' + e.data);
                });
        }

        /**
         * save comment.
         */
        function saveComment() {
            CrudService.createComment(vm.place, vm.comment)
                .then(function (comment) {
                    vm.comment = comment.data;
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                }, function (e) {
                    console.log('comment not saved, cause:' + e.data);
                });
        }

        /**
         * update comment.
         */
        function updateComment() {
            $('#edit-comment-btn').removeClass('hidden');
            $('#updt-comment-btn').addClass('hidden');
            $('#comment-edit').addClass('hidden');
            $('#disp-comment').removeClass('hidden');
            CrudService.updateComment(vm.comment._id, vm.comment)
                .then(function (comment) {
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                }, function (e) {
                    console.log('comment not updated, cause:' + e.data);
                });
        }

        /**
         * save reply.
         * @param cid
         */
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
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                    vm.reply = '';
                },function (e) {
                    console.log('reply not saved:' + e.data);
                });
        }

        /**
         * edit reply, to enable input.
         * @param rid
         */
        function editReply(rid) {
            $('#reply-edit' + rid).addClass('hidden');
            $('#reply-text' + rid).addClass('hidden');
            $('#reply-save' + rid).removeClass('hidden');
            $('#reply-upd' + rid).removeClass('hidden');
        }

        /**
         * updating the reply.
         * @param cid
         * @param rid
         * @param reply
         */
        function updateReply(cid, rid, reply) {
            $('#reply-edit' + rid).removeClass('hidden');
            $('#reply-text' + rid).removeClass('hidden');
            $('#reply-save' + rid).addClass('hidden');
            $('#reply-upd' + rid).addClass('hidden');
            CrudService.updateReply(cid,rid,reply)
                .then(function () {
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                },function (e) {
                    console.log('reply not updated:' + e.data);
                });
        }

        /**
         * deleting a reply
         * @param cid
         * @param rid
         */
        function deleteReply(cid, rid) {
            CrudService.deleteReply(cid,rid)
                .then(function () {
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                            //$route.reload();
                        });
                },function (e) {
                    console.log('reply not deleted:' + e.data);
                });
            
        }

        /**
         * delete comment.
         */
        function deleteComment() {
            vm.comment.text = '';
            CrudService.deleteComment(vm.comment._id)
                .then(function () {
                    CrudService.getComments(vm.place.id)
                        .then(function (comments) {
                            vm.comments = comments.data;
                        });
                    vm.comment = '';
                },function (e) {
                    console.log('comment not deleted' + e.data);
                });
        }

        /**
         * to view user profile.
         * @param uid
         */
        function viewProfile(uid) {
            if (vm.user != '0') {
                UserService.back.push('details/' + vm.location + '/' + vm.query + '/' + vm.page + '/' + vm.pid);
                $location.url("/user/" + uid);
            }
        }

        /**
         * to enable comment edit.
         */
        function editComment() {
            $('#edit-comment-btn').addClass('hidden');
            $('#updt-comment-btn').removeClass('hidden');
            $('#comment-edit').removeClass('hidden');
            $('#disp-comment').addClass('hidden');
        }

        /**
         * to open reply box.
         * @param id
         */
        function openReply(id) {
            $('#opn-reply' + id).addClass('hidden');
            $('#reply-inp' + id).removeClass('hidden');
            $('#reply-comment-btn' + id).removeClass('hidden');
        }

        /**
         * initialize google map
         * @param location
         */
        function initMap(location) {
            var lat = location.coordinate.latitude;
            var long = location.coordinate.longitude;
            var location = UserService.location;
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

        /**
         * get address from yelp response
         * @param addr
         * @returns {string}
         */
        function getAddress(addr) {
            var address = '';
            for(a in addr){
                address = address + addr[a];
            }
            return address;
        }

        /**
         * get cuisine from yelp response
         * @param cs
         * @returns {string}
         */
        function getCuisine(cs) {
            var cuisine = '';
            for(c in cs){
                cuisine = cuisine + cs[c];
            }
            return cuisine;
        }

    }

})();