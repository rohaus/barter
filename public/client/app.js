angular.module('barterApp', ['imageupload', 'ngRoute'])
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
    .when('/login', {
      templateUrl: '/templates/login.html',
      controller: 'LoginCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});