'use strict';

angular.module('barterApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.center = {
      latitude: 37.7833,
      longitude: -122.4167
    };
    $scope.markers = [];
    $scope.zoom = 8;
  });