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

          var infowindow = new google.maps.InfoWindow();

          var marker, i, j;
          for(i = 0; i < barterItems.length; i++){
            var posts = barterItems[i].messages;
            for (j = 0; j < posts.length; j++) {
              var post = posts[j];
              console.log(post, "message from one user");
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(post.geo.lat, post.geo.lng),
                map: $scope.map
              });

              google.maps.event.addListener(marker, 'click', (function(marker, j) {
                return function() {
                  infowindow.setContent('<h1>'+post.description+'</h1>'+'<img src="'+post.img+'"/>');
                  infowindow.open($scope.map, marker);
                };
              })(marker, j));
            }
          }
        })
        .error(function(data, status, headers, config){
          console.log("it failed");
        });
    };

    $scope.postRedirect = function(){
      $location.path('/post');
    };
  });