angular.module('barterApp')
  .controller('ConvCtrl', function($scope, $location, $http, $rootScope){
    $scope.sendMessage = function(){
      // $scope.data = {
      //   'participants': [{
      //     'fbId': $rootScope.fbId,
      //     'name': $rootScope.name
      //   },{
      //     'fbId': $rootScope.fbId,
      //     'name': $rootScope.name
      //   }],
      //   'topic': $scope.topic,
      //   'message': $scope.message
      // };
      // $http.post('/sendNewMessage', $scope.data)
      // .success(function(data, status, headers, config){
      //   console.log("SUCCESS!");
      // })
      // .error(function(data, status){
      //   console.log("ERROR :(");
      // });
    };

    $scope.expand = function(message){
      message.expand = !message.expand;
    };

    $scope.renderMessages = function(){
      $http.get('/messages')
        .success(function(data, status, headers, config){
          console.log("success fetching messages!");
          $scope.conversations = data;
          console.log(data);
        })
        .error(function(data, status, headers, config){
          console.log("error fetching messages");
        });
      };
  });
