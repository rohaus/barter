angular.module('barterApp')
        .controller('PostCtrl', function ($scope, $location, $http, $rootScope, $routeParams, $route) {

            console.log('$rootScope.editPostData', $rootScope.editPostData);
            if ($rootScope.editPostData) {
                $scope.editItemName = $rootScope.editPostData.itemName;
                $scope.editCondition = $rootScope.editPostData.condition;
                $scope.editDescription = $rootScope.editPostData.description;
                $scope.image = $rootScope.editPostData.image;
                $scope.post_id = $rootScope.editPostData._id;
            } else {
                if ($routeParams.id) {
                    $location.path('/');
                }
            }
            $scope.updateImage = function (image) {
                console.log('update image is being called');
                $scope.spinnerToggle();
                $scope.disabled = true;
                var updatePost = function (location) {

                    $scope.editData = {
                        post_id: $scope.post_id,
                        fbId: $rootScope.fbId,
                        name: $rootScope.name,
                        itemName: $scope.editItemName,
                        condition: $scope.editCondition,
                        description: $scope.editDescription,
                        location: [location.lat, location.lng],
                        image: $scope.image
                    };
                    console.log($scope.editData);
                    $http.post('/updatePost', $scope.editData)
                            .success(function (data, status, headers, config) {
                                console.log('SUCCESS!');
                                console.log('image was submitted');
                                $scope.spinnerToggle();
                                $location.path('/');
                            })
                            .error(function (data, status) {
                                console.log('ERROR :(');
                                $scope.disabled = false;
                            });

                }

                if ($rootScope.user_lat && $rootScope.user_long) {
                    var selected_lat = $rootScope.user_lat;
                    var selected_long = $rootScope.user_long;
                    if (selected_lat && selected_long) {
                        var location = {
                            lat: selected_lat,
                            lng: selected_long
                        };
                        updatePost(location);
                    }
                } else {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var selected_lat = position.coords.latitude;
                        var selected_long = position.coords.longitude;
                        if (selected_lat && selected_long) {
                            var location = {
                                lat: selected_lat,
                                lng: selected_long
                            };
                            updatePost(location);
                        }
                    }, function (error) {
                        console.log(error);
                        if (error.code == error.PERMISSION_DENIED)
                        {
                                                       alert("Location Required. You have one of two options: Either Set location manually on map before posting Or Allow browser to automatically capture your location");
                            $route.reload();
                        }
                    });
                }

            };
            $scope.postImage = function (image) {
                console.log('post image is being called');
                $scope.spinnerToggle();
                $scope.disabled = true;
                var postToDatabase = function (location) {
                    $scope.data = {
                        fbId: $rootScope.fbId,
                        name: $rootScope.name,
                        itemName: $scope.itemName,
                        condition: $scope.condition,
                        description: $scope.description,
                        location: [location.lat, location.lng],
                        image: $scope.image
                    };

                    $http.post('/post', $scope.data)
                            .success(function (data, status, headers, config) {
                                console.log('SUCCESS!');
                                console.log('image was submitted');
                                $scope.spinnerToggle();
                                $location.path('/');
                            })
                            .error(function (data, status) {
                                console.log('ERROR :(');
                                $scope.disabled = false;
                            });
                };
                if ($rootScope.user_lat && $rootScope.user_long) {
                    var selected_lat = $rootScope.user_lat;
                    var selected_long = $rootScope.user_long;

                    if (selected_lat && selected_long) {
                        var location = {
                            lat: selected_lat,
                            lng: selected_long
                        };
                        postToDatabase(location);
                    }
                } else {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var selected_lat = position.coords.latitude;
                        var selected_long = position.coords.longitude;

                        if (selected_lat && selected_long) {
                            var location = {
                                lat: selected_lat,
                                lng: selected_long
                            };
                            postToDatabase(location);
                        }
                    }, function (error) {
                        console.log(error);
                        if (error.code == error.PERMISSION_DENIED)
                        {
                                                    alert("Location Required. You have one of two options: Either Set location manually on map before posting Or Allow browser to automatically capture your location");
                            $route.reload();

                        }
                    });
                }


            };
            $scope.postSpinnerDisplay = false;
            $scope.spinnerToggle = function () {
                console.log($scope.postSpinnerDisplay);
                $scope.postSpinnerDisplay = !$scope.postSpinnerDisplay;
            };
        });
