angular.module('barterApp')
  .controller('MapCtrl', function ($scope, $location, $http, $rootScope) {
    $scope.zoom = 11;
    $scope.center = new google.maps.LatLng(37.7837749,-122.4167);
    $scope.mapTypeId = google.maps.MapTypeId.ROADMAP;

    $scope.initialize = function(){
      google.maps.visualRefresh = true;
      var timeout,
      mapOptions = {
        zoom: $scope.zoom,
        center: $scope.center,
        mapTypeId: $scope.mapTypeId
      };
      $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      $scope.oms = new OverlappingMarkerSpiderfier($scope.map);
      $scope.updateLocation();
      $scope.bounds = $scope.map.getBounds();
      // google.maps.event.addListener($scope.map,'bounds_changed', function(){
      //   clearTimeout(timeout);
      //   timeout = setTimeout(function () {
      //     $scope.bounds = $scope.map.getBounds();
      //     $scope.addMarkers($scope.bounds.toUrlValue());
      //   }, 500);
      // });
      $scope.addMarkers();
    };

    $scope.clearMarkers = function(){
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(null);
      }
    };

    $scope.updateLocation = function(){
      navigator.geolocation.getCurrentPosition(function (position) {
        $scope.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.map.setZoom(16);
        $scope.map.setCenter($scope.center);
      });
    };

    $scope.addMarkers = function(coords){
      if($scope.markers){
        $scope.clearMarkers();
      }
      $http.get('/items')
        .success(function(data, status, headers, config){
          console.log("The items have been retrieved from the database", data);
          var barterItems = data,
          length = barterItems.length;

          $scope.posts = data;

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
          $scope.markers = [];
          var marker, i;
          for(i = 0; i < length; i++){
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(barterItems[i].loc.coordinates[1], barterItems[i].loc.coordinates[0]),
              map: $scope.map
            });
            $scope.markers.push(marker);
            $scope.oms.addMarker(marker);
            $scope.addInfoBox(marker, i, barterItems, infobox);
          }
          var mcOptions = {gridSize: 5, maxZoom: 15};
          var mc = new MarkerClusterer($scope.map, $scope.markers, mcOptions);
        })
        .error(function(data, status, headers, config){
          console.log("adding markers failed");
        });
    };

    $scope.addInfoBox = function(marker, i, barterItems, infobox){
      google.maps.event.addListener(marker, 'mouseover', function() {
        if( marker._omsData === undefined ){
          google.maps.event.trigger(marker,'click');
        }
      });
      google.maps.event.addListener(marker, 'mouseup', function() {
        var content = '<div class="infobox"><img src="'+barterItems[i].image+'"/>'+
          '<h2 id="itemName">Item Name: '+barterItems[i].itemName+'</h2>'+
          '<h2 id="description">Description: '+barterItems[i].description+'</h2>'+
          '<h2 id="condition">Condition: '+ barterItems[i].condition+'</h2>'+
          '<h2 id="name">Contact: '+barterItems[i].name+'</h2>'+
          '<h2 id="fbId">'+barterItems[i].fbId+'</h2>'+
          '<h2 id="_id">'+barterItems[i]._id+'</h2>'+
          '<button id="barterButton">Barter</button></div>';
          // '<h2>Email:'+barterItems[i].email+'</h2>'
        infobox.open($scope.map, marker);
        infobox.setContent(content);
        google.maps.event.addListener(infobox, 'domready', function() {
          document.getElementById("barterButton").addEventListener("click", function(e) {
            $scope.displayNewConversation();
            $scope.recipient = {};
            $scope.recipient.itemName = document.getElementById("itemName").textContent.split(": ")[1];
            $scope.recipient.description = document.getElementById("description").textContent.split(": ")[1];
            $scope.recipient.condition = document.getElementById("condition").textContent.split(": ")[1];
            $scope.recipient.name = document.getElementById("name").textContent.split(": ")[1];
            $scope.recipient.fbId = document.getElementById("fbId").textContent;
            $scope.recipient._id = document.getElementById("_id").textContent;
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

    $scope.newConversationDisplay = false;

    $scope.displayNewConversation = function(){
      $scope.newConversationDisplay = !$scope.newConversationDisplay;
    };

    $scope.sendNewConversation = function(recipient){
      $scope.data = {
        'requestingUser': {
          'fbId': $rootScope.fbId,
          'name': $rootScope.name
        },
        'message': $scope.newConversation,
        'from': $rootScope.name,
        '_id': recipient._id
      };
      $http.post('/sendNewConversation', $scope.data)
      .success(function(data, status, headers, config){
        console.log("SUCCESS!");
        $scope.newConversation = '';
      })
      .error(function(data, status){
        console.log("ERROR :(");
      });
    };

    $scope.search = function (post){
      if (post.itemName.indexOf($scope.searchText)!=-1 ||
          post.description.indexOf($scope.searchText)!=-1 ||
          post.condition.indexOf($scope.searchText)!=-1 ||
          post.name.indexOf($scope.searchText)!=-1) {
        return true;
      }
      return false;
    };

  });
