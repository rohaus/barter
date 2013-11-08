angular.module('barterApp')
  .controller('MapCtrl', function ($scope, $location, $http, $rootScope) {
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
                  '<h2>Contact: '+barterItems[i].name+'</h2>'+
                  '<button ng-click="displayNewMessage()">Reply</button>');
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

    $scope.convRedirect = function(){
      $location.path('/conversations');
    };

    $scope.logout = function(){
      $http.post('/logout')
        .success(function(data, status, headers, config){
          console.log("Attempting to logout");
        });
    };

    $scope.newMessageDisplay = false;

    $scope.displayNewMessage = function(){
      console.log("it's being clicked");
      $scope.newMessageDisplay = !$scope.newMessageDisplay;
    };

    $scope.sendNewMessage = function(recipient){
      console.log("recipient being sent in is: ", recipient);
      $scope.data = {
        'participants': [{
          'fbId': $rootScope.fbId,
          'name': $rootScope.name
        },{
          'name': $scope.recipient
        }],
        'topic': $scope.newTopic,
        'message': $scope.newMessage,
        'from': $rootScope.name
      };

      $http.post('/sendNewMessage', $scope.data)
      .success(function(data, status, headers, config){
        console.log("SUCCESS!");
        $scope.newTopic = $scope.newMessage = $scope.recipient = '';
      })
      .error(function(data, status){
        console.log("ERROR :(");
      });
    };

  });
