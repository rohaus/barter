angular.module('barterApp', ['imageupload', 'ngRoute'])
.config(function($httpProvider, $locationProvider, $routeProvider){
  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope){
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedIn').success(function(user){
      // Authenticated
      if (user !== '0'){
        $rootScope.name = user.name;
        $rootScope.fbId = user.fbId;
        $timeout(deferred.resolve, 0);
      }
      // Not Authenticated
      else {
        $timeout(function(){deferred.reject();}, 0);
        $location.path('/login');
      }
    });
    return deferred.promise;
  };
  $httpProvider.responseInterceptors.push(function($q, $location){
    return function(promise){
      return promise.then(
        // Success: just return the response
        function(response){
          return response;
        },
        // Error: check the error status to get only the 401
        function(response){
          if (response.status === 401) {
            console.log("it was intercepted and there was a 401 status");
            $location.path('/login');
          return $q.reject(response);
          }
        }
      );
    };
  });
  $routeProvider
  .when('/', {
    templateUrl: '/templates/main.html',
    controller: 'MapCtrl',
    resolve: {
      loggedin: checkLoggedIn
    }
  })
  .when('/post', {
    templateUrl: '/templates/post.html',
    controller: 'PostCtrl',
    resolve: {
      loggedin: checkLoggedIn
    }
  })
  .when('/conversations', {
    templateUrl: '/templates/conversations.html',
    controller: 'ConvCtrl',
    resolve: {
      loggedin: checkLoggedIn
    }
  })
  .when('/login', {
    templateUrl: '/templates/login.html'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.run(function($rootScope, $http){
  $rootScope.logout = function(){
    $http.post('/auth/facebook');
  };
});
