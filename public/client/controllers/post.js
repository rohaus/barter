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
      // var location = {};
      // navigator.geolocation.getCurrentPosition(function (position) {
      //   location = {
      //     lat: position.coords.latitude,
      //     lng: position.coords.longitude
      //   };
      //   console.log("this stuff is getting called");
      // });
      // console.log("location is:",location);
      $scope.data = {
        value: $scope.value,
        description: $scope.description,
        location: {lat:37.7833, lng:-122.4167},
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
});