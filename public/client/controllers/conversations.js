angular.module('barterApp')
  .controller('ConvCtrl', function($scope, $location, $http, $rootScope){
    $scope.newMessageDisplay = false;

    $scope.displayNewMessage = function(){
      $scope.newMessageDisplay = !$scope.newMessageDisplay;
    };

    $scope.sendNewMessage = function(){
      $scope.data = {
        'participants': [{
          'fbId': $rootScope.fbId,
          'name': $rootScope.name
        },{
          'name': $scope.recipient
        }],
        'topic': $scope.newTopic,
        'message': $scope.newMessage,
        'from': $rootScope.name
      };
      debugger;
      $http.post('/sendNewMessage', $scope.data)
      .success(function(data, status, headers, config){
        console.log("SUCCESS!");
        $scope.newTopic = $scope.newMessage = $scope.recipient = '';
      })
      .error(function(data, status){
        console.log("ERROR :(");
      });
    };

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

    $scope.expand = function(conversation){
      conversation.expand = !conversation.expand;
    };

    $scope.renderMessages = function(){
      $scope.conversations = [{
        'topic': "test topic",
        'name': "test name",
        'message': "test message",
        'sent': "test sent time",
        'expand': false
      },{
        'topic': "test topic 2",
        'name': "test name 2",
        'message': "test message 2",
        'sent': "test sent time 2",
        'expand': false
      }];
    };
  });
