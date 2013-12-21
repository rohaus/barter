angular.module('barterApp')
.factory('MapService', function($http, $rootScope) {
  var service = {};

  service.styles = [
    {
      stylers: [
        { hue: '#6699cc' },
        { saturation: -20 }
      ]
    },{
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },{
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];

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

    service.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    service.oms = new OverlappingMarkerSpiderfier(service.map);
    service.addMarkers();
    service.map.setOptions({styles: service.styles});
  };

  service.updateLocation = $rootScope.updateLocation = function(){
    $rootScope.spinnerToggle();
    navigator.geolocation.getCurrentPosition(function (position) {
      service.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      service.map.setZoom(16);
      service.map.setCenter(service.center);
      $rootScope.spinnerToggle();
      $rootScope.$digest();
    });
  };

  service.infoboxOptions = {
    disableAutoPan: false,
    maxWidth: 150,
    pixelOffset: new google.maps.Size(-140, 0),
    zIndex: null,
    boxStyle: {
      background: 'url("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif") no-repeat',
      width: '280px'
    },
    closeBoxMargin: '12px 4px 2px 2px',
    closeBoxURL: 'http://www.google.com/intl/en_us/mapfiles/close.gif',
    infoBoxClearance: new google.maps.Size(1, 1)
  };

  service.mcOptions = {gridSize: 5, maxZoom: 15};

  service.createMarker = function(i){
    return new google.maps.Marker({
      position: new google.maps.LatLng($rootScope.posts[i].loc.coordinates[1], $rootScope.posts[i].loc.coordinates[0]),
      map: service.map
    });
  };

  service.addMarkers = function(coords){
    $http.get('/posts')
    .success(function(data, status, headers, config){
      $rootScope.posts = data;

      var length = $rootScope.posts.length,
      i, marker;
      service.markers = [];

      var infobox = new InfoBox(service.infoboxOptions);

      for(i = 0; i < length; i++){
        if(!$rootScope.posts[i].completed){
          marker = service.createMarker(i);
          $rootScope.posts[i].__gm_id = marker.__gm_id;
          service.markers.push(marker);
          service.oms.addMarker(marker);
          google.maps.event.addListener(marker, 'mouseover', function() {
            if( marker._omsData === undefined ){
              google.maps.event.trigger(marker,'click');
            }
          });
          service.setInfoBoxContent(marker, i, infobox);
        }
      }
      google.maps.event.addListener(infobox, 'domready', function() {
        document.getElementById('barterButton').addEventListener('click', function(e) {
          $rootScope.spinnerToggle();
          $rootScope.recipient = {};
          $rootScope.recipient.itemName = document.getElementById('itemName').textContent.split(': ')[1];
          $rootScope.recipient.description = document.getElementById('description').textContent.split(': ')[1];
          $rootScope.recipient.condition = document.getElementById('condition').textContent.split(': ')[1];
          $rootScope.recipient.name = document.getElementById('name').textContent.split(': ')[1];
          $rootScope.recipient.fbId = document.getElementById('fbId').textContent;
          $rootScope.recipient._id = document.getElementById('_id').textContent;
          $rootScope.togglePostModal();
          $rootScope.$digest();
          $rootScope.spinnerToggle();
        });
      });
      var mc = new MarkerClusterer(service.map, service.markers, service.mcOptions);
    $rootScope.spinnerToggle();
    })
    .error(function(data, status, headers, config){
    });
  };

  service.infoboxContent = function(i){
    return '<div class="infobox"><img src="' + $rootScope.posts[i].image + '"/>' +
           '<h2 id="itemName">Item Name: ' + $rootScope.posts[i].itemName + '</h2>' +
           '<h2 id="description">Description: ' + $rootScope.posts[i].description + '</h2>' +
           '<h2 id="condition">Condition: ' +  $rootScope.posts[i].condition + '</h2>' +
           '<h2 id="name">Contact: ' + $rootScope.posts[i].name + '</h2>' +
           '<h2 id="fbId">' + $rootScope.posts[i].fbId + '</h2>' +
           '<h2 id="_id">' + $rootScope.posts[i]._id + '</h2>' +
           '<button id="barterButton">Barter</button></div>';
  };

  service.setInfoBoxContent = function(marker, i, infobox) {
    google.maps.event.addListener(marker, 'mouseup', function() {
      $rootScope.spinnerToggle();
      infobox.open(service.map, marker);
      infobox.setContent(service.infoboxContent(i));
      $rootScope.spinnerToggle();
    });
  };

  service.trigger = function(gm_id){
    for (var i = 0; i < service.markers.length; i++) {
      var marker = service.markers[i];
      if(marker.__gm_id === gm_id){
        service.center = new google.maps.LatLng(marker.position.ob,marker.position.pb);
        service.map.setCenter(service.center);
        service.map.setZoom(16);
        google.maps.event.trigger(marker,'mouseup');
        $rootScope.spinnerToggle();
        break;
      }
    }
  };

  return service;
});
