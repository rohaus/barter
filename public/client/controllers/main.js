angular.module('barterApp')
  .controller('MapCtrl', function ($scope, $location) {
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
      $scope.addMarkers();
    };

    $scope.updateLocation = function(){
      navigator.geolocation.getCurrentPosition(function (position) {
        $scope.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.map.setZoom(16);
        $scope.map.setCenter($scope.center);
      });
    };

    $scope.addMarkers = function(){
      var barterItems = [];

      var infowindow = new google.maps.InfoWindow();

      var marker, i;

      for (i = 0; i < barterItems.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(barterItems[i][1], barterItems[i][2]),
          map: $scope.map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(barterItems[i][0]);
            infowindow.open($scope.map, marker);
          };
        })(marker, i));
      }
    };

    $scope.postRedirect = function(){
      $location.path('/post');
    };
  });