angular.module('barterApp')
  .controller('ConvCtrl', function($scope, $location, $http, $rootScope){
    $scope.sendMessage = function(){
      $scope.data = {
        fbId: $rootScope.fbId,
        name: $rootScope.name,
        topic: $scope.topic,
        message: $scope.message
      };
      $http.post('/sendMessage', $scope.data)
      .success(function(data, status, headers, config){
        console.log("SUCCESS!");
      })
      .error(function(data, status){
        console.log("ERROR :(");
      });
    };

    $scope.expand = function(conversation){
      console.log("expanding!");
      conversation.expand = !conversation.expand;
    };

    $scope.renderMessages = function(){
      $scope.conversations = [{
        topic: "test topic",
        name: "test name",
        message: "test message",
        sent: "test sent time",
        expand: false
      },{
        topic: "test topic 2",
        name: "test name 2",
        message: "test message 2",
        sent: "test sent time 2",
        expand: false
      }];
    };
  });
