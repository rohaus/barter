angular.module('barterApp', ['imageupload', 'ngRoute'])
.config(function($httpProvider, $locationProvider, $routeProvider){
  // Success callback, just return the response
  var success = function(response){
    return response;
  };

  // Error callback, check the error status to get only the 401
  var error = function(response){
    if(response.status === 401){
      console.log('it was intercepted and there was a 401 status');
      $location.path('/login');
    return $q.reject(response);
    }
  };

  // Intercept all http requests and verify the user is authenticated
  $httpProvider.responseInterceptors.push(function(){
    return function(promise){
      return promise.then(success, error);
    };
  });

  var checkLoggedIn = function(){
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedIn').success(function(res){
      // If authenticated set rootScope name and fbId
      // Else redirect to login
      if(res !== '401'){
        $rootScope.name = res.name;
        $rootScope.fbId = res.fbId;
        $timeout(deferred.resolve, 0);
      }else{
        $timeout(function(){deferred.reject();}, 0);
        $location.path('/login');
      }
    });
    return deferred.promise;
  };

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
  .when('/dashboard', {
    templateUrl: '/templates/dashboard.html',
    controller: 'ConvCtrl',
    resolve: {
      loggedin: checkLoggedIn
    }
  })
  .when('/login', {
    templateUrl: '/templates/login.html',
    controller: 'MapCtrl'
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
