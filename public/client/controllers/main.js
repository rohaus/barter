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

          var infobox = new InfoBox({
            disableAutoPan: false,
            maxWidth: 150,
            pixelOffset: new google.maps.Size(-140, 0),
            zIndex: null,
            boxStyle: {
              background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
              opacity: 0.85,
              width: "280px"
            },
            closeBoxMargin: "12px 4px 2px 2px",
            closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            infoBoxClearance: new google.maps.Size(1, 1)
          });

          var marker, i;
          for(i = 0; i < length; i++){
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(barterItems[i].loc.coordinates[0], barterItems[i].loc.coordinates[1]),
              map: $scope.map
            });
            $scope.addInfoBox(marker, i, barterItems, infobox);
          }
        })
        .error(function(data, status, headers, config){
          console.log("adding markers failed");
        });
    };

    $scope.addInfoBox = function(marker, i, barterItems, infobox){
      google.maps.event.addListener(marker, 'click', function() {
        var content = '<div class="infobox"><img src="'+barterItems[i].image+'"/>'+
          '<h2 id="description">Description: '+barterItems[i].description+'</h2>'+
          '<h3 id="value">Value: '+ barterItems[i].value+'</h3>'+
          '<h2 id="name">Contact: '+barterItems[i].name+'</h2>'+
          '<h2 id="fbId">'+barterItems[i].fbId+'</h2>'+
          '<button id="barterButton">Barter</button></div>';
          // '<h2>Email:'+barterItems[i].email+'</h2>'
        infobox.open($scope.map, marker);
        infobox.setContent(content);
        google.maps.event.addListener(infobox, 'domready', function() {
          document.getElementById("barterButton").addEventListener("click", function(e) {
            $scope.displayNewMessage();
            $scope.recipient = {};
            $scope.recipient.fbId = document.getElementById("fbId").textContent;
            $scope.recipient.name = document.getElementById("name").textContent.split(": ")[1];
            $scope.recipient.description = document.getElementById("description").textContent.split(": ")[1];
            console.log($scope.recipient);
            $scope.$digest();
          });
        });
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
      $scope.newMessageDisplay = !$scope.newMessageDisplay;
    };

    $scope.sendNewMessage = function(recipient){
      console.log("recipient being sent in is: ", recipient);
      $scope.data = {
        'participants': [{
          'fbId': $rootScope.fbId,
          'name': $rootScope.name
        },{
          'fbId': $scope.recipient.fbId,
          'name': $scope.recipient.name
        }],
        'topic': $scope.recipient.topic,
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
