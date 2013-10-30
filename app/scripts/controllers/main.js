'use strict';

angular.module('barterApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.geolocationAvailable = navigator.geolocation ? true : false;
    $scope.latitude = null;
    $scope.longitude = null;
    $scope.zoom = 11;
    $scope.center = {
      latitude: 37.7833,
      longitude: -122.4167
    };
    $scope.findMe = function () {
      if ($scope.geolocationAvailable) {
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.center = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          $scope.$apply();
        }, function () {
        });
      }
      $scope.zoom = 16;
    };
  });