angular.module('barterApp')
  .controller('MapCtrl', function ($scope, $location, $http) {
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
      $http.get('/items')
        .success(function(data, status, headers, config){
          console.log("The items have been retrieved from the database", data);
          var barterItems = data;
          var length = barterItems.length;
          var infowindow = new google.maps.InfoWindow();

          var marker, i;
          for(i = 0; i < length; i++){
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(barterItems[i].loc.coordinates[0], barterItems[i].loc.coordinates[1]),
              map: $scope.map
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                infowindow.setContent('<div class="infoWindow"><img src="'+barterItems[i].image+'"/>'+
                  '<h2>Description: '+barterItems[i].description+'</h2>'+
                  '<h3>Value: '+ barterItems[i].value+'</h3></div>'+
                  '<h2>Contact: '+barterItems[i].name+'</h2>');
                  // '<h2>Email:'+barterItems[i].email+'</h2>'
                infowindow.open($scope.map, marker);
              };
            })(marker, i));
          }
        })
        .error(function(data, status, headers, config){
          console.log("adding markers failed");
        });
    };

    $scope.postRedirect = function(){
      $location.path('/post');
    };

    $scope.logout = function(){
      $http.post('/logout')
        .success(function(data, status, headers, config){
          console.log("Attempting to logout");
        });
    };
  });
