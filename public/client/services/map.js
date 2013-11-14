angular.module('barterApp')
.factory('MapService', function($http, $rootScope) {
  var service = {};


  service.initialize = function(){
    service.zoom = 11;
    service.center = new google.maps.LatLng(37.7837749,-122.4167);
    service.mapTypeId = google.maps.MapTypeId.ROADMAP;
    google.maps.visualRefresh = true;

    var mapOptions = {
      zoom: service.zoom,
      center: service.center,
      mapTypeId: service.mapTypeId
    };

    service.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    service.oms = new OverlappingMarkerSpiderfier(service.map);
    service.updateLocation();
    service.addMarkers();
  };

  service.updateLocation = $rootScope.updateLocation = function(){
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("this is getting called!");
      service.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      service.map.setZoom(16);
      service.map.setCenter(service.center);
    });
  };

  service.infoboxOptions = {
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
  };

  service.mcOptions = {gridSize: 5, maxZoom: 15};

  service.createMarker = function(i){
    return new google.maps.Marker({
      position: new google.maps.LatLng($rootScope.posts[i].loc.coordinates[1], $rootScope.posts[i].loc.coordinates[0]),
      map: service.map
    })
  };

  service.addMarkers = function(coords){
    $http.get('/items')
    .success(function(data, status, headers, config){
      console.log("The items have been retrieved from the database", data);
      $rootScope.posts = data;

      var length = $rootScope.posts.length,
      i, marker;
      service.markers = [];

      var infobox = new InfoBox(service.infoboxOptions);

      for(i = 0; i < length; i++){
        marker = service.createMarker(i);
        service.markers.push(marker);
        service.oms.addMarker(marker);
        google.maps.event.addListener(marker, 'mouseover', function() {
          if( marker._omsData === undefined ){
            google.maps.event.trigger(marker,'click');
          }
        });
        service.setInfoBoxContent(marker, i, infobox);
      }
      google.maps.event.addListener(infobox, 'domready', function() {
        document.getElementById("barterButton").addEventListener("click", function(e) {
          $rootScope.recipient = {};
          $rootScope.recipient.itemName = document.getElementById("itemName").textContent.split(": ")[1];
          $rootScope.recipient.description = document.getElementById("description").textContent.split(": ")[1];
          $rootScope.recipient.condition = document.getElementById("condition").textContent.split(": ")[1];
          $rootScope.recipient.name = document.getElementById("name").textContent.split(": ")[1];
          $rootScope.recipient.fbId = document.getElementById("fbId").textContent;
          $rootScope.recipient._id = document.getElementById("_id").textContent;
          console.log($rootScope.recipient);
          $rootScope.displayNewConversation();
          $rootScope.$digest();
        });
      });
      var mc = new MarkerClusterer(service.map, service.markers, service.mcOptions);
    })
    .error(function(data, status, headers, config){
      console.log("adding markers failed");
    });
  };

  service.infoboxContent = function(i){
    return '<div class="infobox"><img src="'+$rootScope.posts[i].image+'"/>'+
           '<h2 id="itemName">Item Name: '+$rootScope.posts[i].itemName+'</h2>'+
           '<h2 id="description">Description: '+$rootScope.posts[i].description+'</h2>'+
           '<h2 id="condition">Condition: '+ $rootScope.posts[i].condition+'</h2>'+
           '<h2 id="name">Contact: '+$rootScope.posts[i].name+'</h2>'+
           '<h2 id="fbId">'+$rootScope.posts[i].fbId+'</h2>'+
           '<h2 id="_id">'+$rootScope.posts[i]._id+'</h2>'+
           '<button id="barterButton">Barter</button></div>';
  };

  service.setInfoBoxContent = function(marker, i, infobox) {
    google.maps.event.addListener(marker, 'mouseup', function() {
      infobox.open(service.map, marker);
      infobox.setContent(service.infoboxContent(i));
    });
  };

  return service;
});
