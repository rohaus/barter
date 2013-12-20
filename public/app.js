angular.module('barterApp', ['imageupload', 'ngRoute'])
.config(function($httpProvider, $locationProvider, $routeProvider){

  // Success callback, just return the response
  var success = function(response){
    return response;
  };

  // Intercept all http requests and verify the user is authenticated
  // On success return the response
  // On error redirect to the login page
  $httpProvider.responseInterceptors.push(function($q, $location){
    return function(promise){
      return promise.then(success, function(response){
        if(response.status === 401){
          console.log('it was intercepted and there was a 401 status');
          $location.path('/login');
          return $q.reject(response);
        }
      });
    };
  });

  var checkLoggedIn = function($q, $http, $location, $rootScope){
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedIn').success(function(res){
      // If authenticated set rootScope name and fbId
      // Else redirect to login
      if(res !== '401'){
        $rootScope.name = res.name;
        $rootScope.fbId = res.fbId;
        deferred.resolve();
      }else{
        deferred.reject();
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
