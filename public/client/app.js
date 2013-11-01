angular.module('barterApp', [])
.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/templates/main.html',
      controller: 'MapCtrl'
    })
    .when('/post', {
      templateUrl: '/templates/post.html',
      controller: 'PostCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});