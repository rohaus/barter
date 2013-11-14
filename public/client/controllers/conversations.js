angular.module('barterApp')
.controller('ConvCtrl', function($scope, $location, $http, $rootScope){
  $scope.expand = function(element){
    element = element || true;
    element.expand = !element.expand;
    $scope._id = element._id;
  };

  $scope.sendMessage = function(conversation){
    $scope.data = {
      '_id': conversation._id,
      'message': conversation.reply,
      'from': $rootScope.name
    };
    $http.post('/sendMessage', $scope.data)
    .success(function(data, status, headers, config){
      console.log("Message sent");
      conversation.reply = '';
      var time = new Date();
      conversation.messages.push({
        'message': $scope.data.message,
        'from': $scope.data.from,
        'sentAt': time
      });
    })
    .error(function(data, status){
      console.log("Error sending message");
    });
  };

  $scope.renderMessages = function(){
    $http.get('/messages')
    .success(function(data, status, headers, config){
      console.log("Success fetching messages");
      $scope.posts = data;
      $scope.loopPostsAndConvs(true, true, true, true);
    })
    .error(function(data, status, headers, config){
      console.log("Error fetching messages");
    });
  };

  $scope.deleteConversation = function(conversation, post){
    $scope.data = {
      _id: conversation._id
    };
    $http.post('/deleteConversation', $scope.data)
    .success(function(data, status, headers, config){
      console.log("Success deleting conversation");
      var length = post.conversations.length;
      for(var i = 0; i < length; i++){
        if (post.conversations[i]._id === $scope.data._id){
          post.conversations.splice(i,1);
          break;
        }
      }
    })
    .error(function(data, status, headers, config){
      console.log("Error deleting conversation");
    });
  };

  $scope.deletePost = function(post, posts){
    $scope.data = {
      _id: post._id
    };
    $http.post('/deletePost', $scope.data)
    .success(function(data, status, headers, config){
      console.log("Post deleted");
      var length = posts.length;
      for (var i = 0; i < length; i++){
        if (posts[i]._id === $scope.data._id){
          posts.splice(i,1);
          break;
        }
      }
    })
    .error(function(data, status, headers, config){
      console.log("Error deleting post");
    });
  };

  $scope.respondToBarter = function(conversation, type){
    $scope.data = {
      _id: conversation._id
    };
    $http.post('/'+type, $scope.data)
    .success(function(data, status, headers, config){
      console.log("post to "+type+" accepted");
    })
    .error(function(data, status, headers, config){
      console.log("post to "+type+" rejected");
    });
  };

  $scope.match = true;
  $scope.notMatch = false;

  $scope.loopPosts = function(match, notMatch){
    for (var i = 0; i < $scope.posts.length; i++){
      var post = $scope.posts[i];
      post.show = (post.fbId === $rootScope.fbId) ? match : notMatch;
    }
  };

  $scope.loopPostsAndConvs = function(postComplete, postNotComplete, convComplete, convNotComplete){
    for (var i = 0; i < $scope.posts.length; i++){
      var post = $scope.posts[i];
      post.show = (post.completed) ? postComplete : postNotComplete;
      for (var j = 0; j < post.conversations.length; j++){
        var conversation = post.conversations[j];
        conversation.show = (conversation.accepted !== null) ? convComplete : convNotComplete;
      }
    }
  };
});
