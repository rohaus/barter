'use strict';

angular.module('barterApp')
  .controller('MainCtrl', function ($scope) {
    $scope.geolocationAvailable = navigator.geolocation ? true : false;
    $scope.latitude = null;
    $scope.longitude = null;
    $scope.zoom = 11;
    $scope.center = {
      latitude: 37.7833,
      longitude: -122.4167
    };
    $scope.markers = [];
    $scope.markerLat = null;
    $scope.markerLng = null;
    $scope.items = [{latitude: 37.7837749,longitude:-122.40908739999998},{latitude: 37.7837749,longitude:-122.534},{latitude: 37.7837749,longitude:-122.403}];
    $scope.addMarkers = function () {
      for (var i = 0; i < $scope.items.length; i++){
        var item = $scope.items[i];
        $scope.markers.push({
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude)
        });
      }
      $scope.markerLat = null;
      $scope.markerLng = null;
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
      $scope.addMarkers();
    };
    $scope.helloWorld = function(){
      console.log("Hello World!");
    };
  });