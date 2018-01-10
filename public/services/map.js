angular.module('barterApp')
        .factory('MapService', function ($http, $rootScope,$route) {
            var service = {};

            service.styles = [
                {
                    stylers: [
                        {hue: '#6699cc'},
                        {saturation: -20}
                    ]
                }, {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [
                        {lightness: 100},
                        {visibility: 'simplified'}
                    ]
                }, {
                    featureType: 'road',
                    elementType: 'labels',
                    stylers: [
                        {visibility: 'off'}
                    ]
                }
            ];

            service.initialize = function () {
                service.zoom = 11;
                service.center = new google.maps.LatLng(37.7837749, -122.4167);
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

//    ----------------------           location autocomplete starts

                setTimeout(function () {

                    var input = /** @type {!HTMLInputElement} */ (
                            document.getElementById('pac-input'));
                    service.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
                    var autocomplete = new google.maps.places.Autocomplete(input);
                    autocomplete.bindTo('bounds', service.map);

                    var infowindow = new google.maps.InfoWindow();
                    var marker = new google.maps.Marker({
                        map: service.map,
                        anchorPoint: new google.maps.Point(0, -29),
//                        draggable: true
                    });
                    google.maps.event.addListener(marker, 'dragend', function () {
                        infowindow.close();
                        geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            latLng: marker.getPosition()
                        }, function (responses) {
                            if (responses && responses.length > 0) {
                                $rootScope.user_lat = marker.getPosition().lat();
                                $rootScope.user_long = marker.getPosition().lng();
                                infowindow.setContent('<div><strong>' + responses[0].formatted_address + '</strong><br>');
                                infowindow.open(service.map, marker);
                                $rootScope.$digest();
                            } else {
                                alert('Cannot determine address at this location.');
                            }
                        });

                    })

                    autocomplete.addListener('place_changed', function () {
                        console.log('changed');
                        infowindow.close();
                        marker.setVisible(false);
                        var place = autocomplete.getPlace();
                        if (!place.geometry) {
                            window.alert("Autocomplete's returned place contains no geometry");
                            return;
                        }
//                        console.log(place);
                        // If the place has a geometry, then present it on a map.
                        if (place.geometry.viewport) {
                            service.map.fitBounds(place.geometry.viewport);
                        } else {
                            service.map.setCenter(place.geometry.location);
                            service.map.setZoom(17); // Why 17? Because it looks good.
                        }
                        marker.setIcon(/** @type {google.maps.Icon} */ ({
                            url: 'http://maps.google.com/mapfiles/ms/icons/red.png',
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(35, 35)
                        }));
                        marker.setPosition(place.geometry.location);
                        marker.setVisible(true);
                        var address = '';
                        if (place.address_components) {
                            address = [
                                (place.address_components[0] && place.address_components[0].short_name || ''),
                                (place.address_components[1] && place.address_components[1].short_name || ''),
                                (place.address_components[2] && place.address_components[2].short_name || '')
                            ].join(' ');
                        }
                        var latitude = place.geometry.location.lat();
                        var longitude = place.geometry.location.lng();
                        console.log(latitude);
                        console.log(longitude);
                        $rootScope.user_lat = latitude;
                        $rootScope.user_long = longitude;
                        $rootScope.$digest();
                        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                        infowindow.open(service.map, marker);
                    });
                }, 1000);

                //---------------------------------location autocomplete  ends
            };

//            service.updateLocation = $rootScope.updateLocation = function () {
//                $rootScope.spinnerToggle();
//                navigator.geolocation.getCurrentPosition(function (position) {
//                    service.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                    service.map.setZoom(16);
//                    service.map.setCenter(service.center);
//                    $rootScope.spinnerToggle();
//                    $rootScope.$digest();
//                });
//            };

            service.updateLocation = $rootScope.updateLocation = function () {
                $rootScope.spinnerToggle();
                var allowed_postion_lat = allowed_postion_long = '';
                if ($rootScope.user_lat && $rootScope.user_long) {
                    var selected_lat = $rootScope.user_lat;
                    var selected_long = $rootScope.user_long;
                      service.center = new google.maps.LatLng(selected_lat, selected_long);
                        service.map.setZoom(16);
                        service.map.setCenter(service.center);
                        $rootScope.spinnerToggle();
                } else {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var   selected_lat = position.coords.latitude;
                        var   selected_long = position.coords.longitude;
                        service.center = new google.maps.LatLng(selected_lat, selected_long);
                        service.map.setZoom(16);
                        service.map.setCenter(service.center);
                        $rootScope.spinnerToggle();
                            $rootScope.$digest();
                    }, function (error) {
                        console.log(error);
                        if (error.code == error.PERMISSION_DENIED)
                        {
                                                             alert("Location Required. You have one of two options: Either Set location manually on map before posting Or Allow browser to automatically capture your location");
                                                             $route.reload();
                        }
                    });
                }

            };
            service.infoboxOptions = {
                disableAutoPan: false,
                maxWidth: 150,
                pixelOffset: new google.maps.Size(-140, 0),
                zIndex: null,
                boxStyle: {
                    background: 'url("https://raw.githubusercontent.com/mindgruve/google-infobox/master/examples/tipbox.gif") no-repeat',
                    width: '280px'
                },
                closeBoxMargin: '12px 4px 2px 2px',
                closeBoxURL: 'https://raw.githubusercontent.com/google/earthenterprise/master/earth_enterprise/src/maps/mapfiles/close.gif',
                infoBoxClearance: new google.maps.Size(1, 1)
            };

            service.mcOptions = {gridSize: 5, maxZoom: 15};

            service.createMarker = function (i) {
                loc = new google.maps.LatLng($rootScope.posts[i].loc.coordinates[1], $rootScope.posts[i].loc.coordinates[0]);
                return new google.maps.Marker({
                    position: loc,
                    map: service.map,
                    bounds: true
                });
            };

            service.addMarkers = function (coords) {
                $http.get('/posts')
                        .success(function (data, status, headers, config) {
                            $rootScope.posts = data;

                            var length = $rootScope.posts.length,
                                    i, marker;
                            service.markers = [];

                            var infobox = new InfoBox(service.infoboxOptions);

                            for (i = 0; i < length; i++) {
                                if (!$rootScope.posts[i].completed) {
                                    marker = service.createMarker(i);
                                    var val = parseInt(i) + parseInt(1);
                                    marker.set("__gm_id", val);
                                    $rootScope.posts[i].__gm_id = marker.get("__gm_id");
                                    service.markers.push(marker);
                                    service.oms.addMarker(marker);
                                    google.maps.event.addListener(marker, 'mouseover', function () {
                                        if (marker._omsData === undefined) {
                                            google.maps.event.trigger(marker, 'click');
                                        }
                                    });
                                    service.setInfoBoxContent(marker, i, infobox);
                                }
                            }
                            google.maps.event.addListener(infobox, 'domready', function () {
                                document.getElementById('barterButton').addEventListener('click', function (e) {
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
                        .error(function (data, status, headers, config) {
                        });
            };

            service.infoboxContent = function (i) {
                return '<div class="infobox"><img src="' + $rootScope.posts[i].image + '"/>' +
                        '<h2 id="itemName">Item Name: ' + $rootScope.posts[i].itemName + '</h2>' +
                        '<h2 id="description">Description: ' + $rootScope.posts[i].description + '</h2>' +
                        '<h2 id="condition">Condition: ' + $rootScope.posts[i].condition + '</h2>' +
                        '<h2 id="name">Contact: ' + $rootScope.posts[i].name + '</h2>' +
                        '<h2 id="fbId">' + $rootScope.posts[i].fbId + '</h2>' +
                        '<h2 id="_id">' + $rootScope.posts[i]._id + '</h2>' +
                        '<button id="barterButton">Barter</button></div>';
            };

            service.setInfoBoxContent = function (marker, i, infobox) {
                google.maps.event.addListener(marker, 'mouseup', function () {
                    $rootScope.spinnerToggle();
                    infobox.open(service.map, marker);
                    infobox.setContent(service.infoboxContent(i));
                    $rootScope.spinnerToggle();
                });
            };

            service.trigger = function (gm_id) {
                for (var i = 0; i < service.markers.length; i++) {
                    var marker = service.markers[i];
                    console.log(marker);
                    if (marker.__gm_id === gm_id) {

//        service.center = new google.maps.LatLng(marker.position.ob,marker.position.pb);
                        service.center = new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
                        service.map.setCenter(service.center);
                        service.map.setZoom(16);
                        google.maps.event.trigger(marker, 'mouseup');
                        $rootScope.spinnerToggle();
                        break;
                    }
                }
            };

            return service;
        });
