angular.module('barterApp')
.controller('PostCtrl', function($scope, $location, $http, $rootScope){
  $scope.postImage = function(image){
    console.log("post image is being called");
    $rootScope.spinnerToggle();
    $scope.disabled = true;
    var postToDatabase = function(location){
      $scope.data = {
        fbId: $rootScope.fbId,
        name: $rootScope.name,
        itemName: $scope.itemName,
        condition: $scope.condition,
        description: $scope.description,
        location: [location.lat, location.lng],
        image: $scope.image
      };

      $http.post('/post', $scope.data)
      .success(function(data, status, headers, config){
        console.log("SUCCESS!");
        console.log("image was submitted");
        $rootScope.spinnerToggle();
        $location.path('/');
      })
      .error(function(data, status){
        console.log("ERROR :(");
        $scope.disabled = false;
      });
    };

    navigator.geolocation.getCurrentPosition(function(position) {
      var location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      postToDatabase(location);
    });
  };
});