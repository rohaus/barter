angular.module('barterApp')
  .controller('PostCtrl', function ($scope, $location, $http){
    $scope.postImage = function(image){
      // var formData = new FormData();
      //   formData.append('image', image, image.name);

      //   $http.post('/post', formData, {
      //       headers: { 'Content-Type': false },
      //       transformRequest: angular.identity
      //   }).success(function(result) {
      //       $scope.uploadedImgSrc = result.src;
      //       $scope.sizeInBytes = result.size;
      //   });

      var postToDatabase = function(location){
        console.log("postToDatabase running");
        $scope.data = {
          value: $scope.value,
          description: $scope.description,
          location: location,
          image: $scope.image
        };
        $http.post('/post', $scope.data)
        .success(function(data, status, headers, config){
          console.log("The scope data being sent is:", $scope.data);
          console.log("SUCCESS!");
          $location.path('/');
        })
        .error(function(data, status){
          console.log("ERROR :(");
        });
      };
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("location is:",position);
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        postToDatabase(location);
      });
  };
});