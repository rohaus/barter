angular.module('barterApp')
  .controller('LoginCtrl', function($scope, $http, $rootScope, $location){
    $scope.login = function(){
      $http.post('/login', {
        username: $scope.user.username,
        password: $scope.user.password,
      })
      .success(function(user){
        // No error: authentication OK
        console.log("success cb for post to /login. The login attempt succeeded");
        $rootScope.message = 'Authentication successful!';
        $location.path('/');
      })
      .error(function(){
        // Error: authentication failed
        console.log("error cb for post to /login. The login attempt failed");
        $rootScope.message = 'Authentication failed.';
        $location.path('/login');
      });
    };
  });