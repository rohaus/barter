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
          'sentAt': time
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
          $scope.posts = data;
        })
        .error(function(data, status, headers, config){
          console.log("error fetching messages");
        });
    };

    // $scope.deleteMessage = function(message){
    //   $scope.data = {
    //     _id: message._id
    //   };
    //   $http.post('/deleteMessage', $scope.data)
    //   .success(function(data, status, headers, config){
    //     console.log("success deleting message!");
    //     // var length = $scope.conversations.length;
    //     // for(var i = 0; i < length; i++){
    //     //   if ($scope.conversations[i]._id === $scope.data._id){
    //     //     $scope.conversations.splice(i,1);
    //     //     break;
    //     //   }
    //     // }
    //   })
    //   .error(function(data, status, headers, config){
    //     console.log("error deleting message");
    //   });
    // };

    $scope.deleteConversation = function(conversation){
      $scope.data = {
        _id: conversation._id
      };
      $http.post('/deleteConversation', $scope.data)
      .success(function(data, status, headers, config){
        console.log("success deleting conversation!");
        var length = $scope.conversations.length;
        for(var i = 0; i < length; i++){
          if ($scope.conversations[i]._id === $scope.data._id){
            $scope.conversations.splice(i,1);
            break;
          }
        }
      })
      .error(function(data, status, headers, config){
        console.log("error deleting conversation");
      });
    };
  });
