angular.module('barterApp')
  .controller('ConvCtrl', function($scope, $location, $http, $rootScope){
    $scope.sendMessage = function(conversation){
      $scope.data = {
        '_id': conversation._id,
        'message': conversation.reply,
        'from': $rootScope.name
      };
      $http.post('/sendMessage', $scope.data)
      .success(function(data, status, headers, config){
        console.log("SUCCESS!");
        conversation.reply = '';
        var time = new Date();
        conversation.messages.push({
          'message': $scope.data.message,
          'from': $scope.data.from,
          'date': time
        });
      })
      .error(function(data, status){
        console.log("ERROR :(");
      });
    };

    $scope.expand = function(element){
      element.expand = !element.expand;
      $scope._id = element._id;
    };

    $scope.renderMessages = function(){
      $http.get('/messages')
        .success(function(data, status, headers, config){
          console.log("success fetching messages!");
          $scope.conversations = data;
        })
        .error(function(data, status, headers, config){
          console.log("error fetching messages");
        });
      };
  });
