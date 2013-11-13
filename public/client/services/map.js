angular.module('barterApp')
.factory('MapService', function($http, $rootScope) {
  var service = {};

  service.zoom = 11;
  service.center = new google.maps.LatLng(37.7837749,-122.4167);
  service.mapTypeId = google.maps.MapTypeId.ROADMAP;

  service.initialize = function(){
    google.maps.visualRefresh = true;
    var timeout,
    mapOptions = {
      zoom: service.zoom,
      center: service.center,
      mapTypeId: service.mapTypeId
    };
    service.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    service.oms = new OverlappingMarkerSpiderfier(service.map);
    service.updateLocation();
    service.addMarkers();
    // Rerenders markers on bound change
    // service.bounds = service.map.getBounds();
    // google.maps.event.addListener(service.map,'bounds_changed', function(){
    //   clearTimeout(timeout);
    //   timeout = setTimeout(function () {
    //     service.bounds = service.map.getBounds();
    //     service.addMarkers(service.bounds.toUrlValue());
    //   }, 500);
    // });
  };

  service.clearMarkers = function(){
    for (var i = 0; i < service.markers.length; i++) {
      service.markers[i].setMap(null);
    }
  };

  service.updateLocation = $rootScope.updatelocation = function(){
    navigator.geolocation.getCurrentPosition(
    function (position) {
      service.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      service.map.setZoom(16);
      service.map.setCenter(service.center);
    });
  };

  service.addMarkers = function(coords){
    if(service.markers){
      service.clearMarkers();
    }
    $http.get('/items')
    .success(function(data, status, headers, config){
      console.log("The items have been retrieved from the database", data);
      var barterItems = data,
      length = barterItems.length;

      $rootScope.posts = data;

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
      service.markers = [];
      var marker, i;
      for(i = 0; i < length; i++){
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(barterItems[i].loc.coordinates[1], barterItems[i].loc.coordinates[0]),
          map: service.map
        });
        service.markers.push(marker);
        service.oms.addMarker(marker);
        service.addInfoBox(marker, i, barterItems, infobox);
      }
      var mcOptions = {gridSize: 5, maxZoom: 15};
      var mc = new MarkerClusterer(service.map, service.markers, mcOptions);
    })
    .error(function(data, status, headers, config){
      console.log("adding markers failed");
    });
  };

  service.addInfoBox = function(marker, i, barterItems, infobox){
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

      infobox.open(service.map, marker);
      infobox.setContent(content);

      google.maps.event.addListener(infobox, 'domready', function() {
        document.getElementById("barterButton").addEventListener("click", function(e) {
          $rootScope.recipient = {};
          $rootScope.recipient.itemName = document.getElementById("itemName").textContent.split(": ")[1];
          $rootScope.recipient.description = document.getElementById("description").textContent.split(": ")[1];
          $rootScope.recipient.condition = document.getElementById("condition").textContent.split(": ")[1];
          $rootScope.recipient.name = document.getElementById("name").textContent.split(": ")[1];
          $rootScope.recipient.fbId = document.getElementById("fbId").textContent;
          $rootScope.recipient._id = document.getElementById("_id").textContent;
          console.log("recipient is:"+$rootScope.recipient);
          $rootScope.displayNewConversation();
          $rootScope.$digest();
        });
      });
    });
  };
  return service;
});
