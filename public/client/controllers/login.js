angular.module('barterApp')
  .controller('LoginCtrl', function($scope, $http, $rootScope, $location){
    $scope.login = function(){
      $http.get('/auth/facebook', {
        username: $scope.user.username,
        password: $scope.user.password,
      })
      .success(function(user){
        // No error: authentication OK
        $location.path('/');
      })
      .error(function(){
        // Error: authentication failed
        $location.path('/login');
      });
    };
  });