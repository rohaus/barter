'use strict';

angular.module('barterApp')
  .controller('MainCtrl', function ($scope) {
    $scope.zoom = 11;
    $scope.center = new google.maps.LatLng(37.7837749,-122.4167);
    $scope.mapTypeId = google.maps.MapTypeId.ROADMAP;

    $scope.initialize = function(){
      google.maps.visualRefresh = true;
      var mapOptions = {
        zoom: $scope.zoom,
        center: $scope.center,
        mapTypeId: $scope.mapTypeId
      };
      $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      $scope.updateLocation();
    };

    $scope.updateLocation = function(){
      navigator.geolocation.getCurrentPosition(function (position) {
        $scope.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // var infowindow = new google.maps.InfoWindow({
        //   map: $scope.map,
        //   position: $scope.center,
        //   content:
        //       '<h1>Location pinned from HTML5 Geolocation!</h1>' +
        //       '<h2>Latitude: ' + position.coords.latitude + '</h2>' +
        //       '<h2>Longitude: ' + position.coords.longitude + '</h2>'
        // });

        $scope.map.zoom = 16;
        $scope.map.setCenter($scope.center);
      });
    }
  });