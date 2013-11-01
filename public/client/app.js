angular.module('barterApp', [])
.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/templates/main.html',
      controller: 'MapCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});