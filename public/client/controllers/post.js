angular.module('barterApp')
  .controller('PostCtrl', function($scope, $location, $http, $rootScope){
    $scope.postImage = function(image){
      var postToDatabase = function(location){
        $scope.data = {
          fbId: $rootScope.fbId,
          name: $rootScope.name,
          // email: $rootScope.email,
          value: $scope.value,
          description: $scope.description,
          location: [location.lat, location.lng],
          image: $scope.image
        };
        $http.post('/post', $scope.data)
        .success(function(data, status, headers, config){
          console.log("SUCCESS!");
          $location.path('/');
        })
        .error(function(data, status){
          console.log("ERROR :(");
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