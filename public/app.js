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

  // Make an AJAX call to check if the user is logged in
  // If authenticated set rootScope name and fbId
  // Else redirect to login
  var checkLoggedIn = function($q, $http, $location, $rootScope){
    var deferred = $q.defer();
    $http.get('/loggedIn').success(function(res){
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

  // Object of functions to resolve before rendering template
  var resolve = {
    loggedin: checkLoggedIn
  };

  $routeProvider
  .when('/', {
    templateUrl: '/templates/main.html',
    controller: 'MapCtrl',
    resolve: resolve
  })
  .when('/post', {
    templateUrl: '/templates/post.html',
    controller: 'PostCtrl',
    resolve: resolve
  })
  .when('/dashboard', {
    templateUrl: '/templates/dashboard.html',
    controller: 'ConvCtrl',
    resolve: resolve
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
