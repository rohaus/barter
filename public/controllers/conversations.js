angular.module('barterApp')
.controller('ConvCtrl', function($scope, $location, $http, $rootScope){
  $scope.sendMessage = function(conversation){
    $scope.data = {
      '_id': conversation._id,
      'message': conversation.reply,
      'from': $rootScope.name
    };
    $http.post('/message', $scope.data)
    .success(function(data, status, headers, config){
      console.log('Message sent');
      conversation.reply = '';
      var time = new Date();
      conversation.messages.push({
        'message': $scope.data.message,
        'from': $scope.data.from,
        'sentAt': time
      });
    })
    .error(function(data, status){
      console.log('Error sending message');
    });
  };

  $scope.renderMessages = function(){
    $http.get('/posts')
    .success(function(data, status, headers, config){
      console.log('Success fetching messages');
      $scope.posts = data;
      $scope.yourPosts();
    })
    .error(function(data, status, headers, config){
      console.log('Error fetching messages');
    });
  };

  $scope.deleteConversation = function(conversation, post){
    if(!confirm('Are you sure you want to delete the conversation?')){
      return;
    }
    $scope.data = {
      _id: conversation._id
    };
    $http.delete('/conversation/' + conversation._id)
    .success(function(data, status, headers, config){
      console.log('Success deleting conversation');
      $scope.toggleConversationModal();
      var length = post.conversations.length;
      for(var i = 0; i < length; i++){
        if (post.conversations[i]._id === conversation._id){
          post.conversations.splice(i,1);
          break;
        }
      }
    })
    .error(function(data, status, headers, config){
      console.log('Error deleting conversation');
    });
  };

  $scope.deletePost = function(post, posts){
    if(!confirm('Are you sure you want to delete the post?')){
      return;
    }
    $http.delete('/post/' + post._id)
    .success(function(data, status, headers, config){
      console.log('Post deleted');
      var length = posts.length;
      for (var i = 0; i < length; i++){
        if (posts[i]._id === post._id){
          posts.splice(i,1);
          break;
        }
      }
    })
    .error(function(data, status, headers, config){
      console.log('Error deleting post');
    });
  };

  $scope.respondToBarter = function(conversation, post, type){
    $http.put('/barter/' + type + '/' + conversation._id)
    .success(function(data, status, headers, config){
      console.log('post to /barter/' + type + ' accepted');
      if(type === 'accept'){
        conversation.accepted = true;
      }
      post.completed = true;
      $scope.toggleConversationModal();
    })
    .error(function(data, status, headers, config){
      console.log('post to /barter/' + type + ' rejected');
    });
  };

  $scope.match = true;
  $scope.notMatch = false;

  $scope.yourPosts = function(){
    for (var i = 0; i < $scope.posts.length; i++){
      var post = $scope.posts[i];
      post.show = (post.fbId === $rootScope.fbId) ? true : false;
    }
  };

  $scope.requests = function(){
    for (var i = 0; i < $scope.posts.length; i++){
      var post = $scope.posts[i];
      post.show = false;
      if(post.fbId !== $rootScope.fbId){
        for(var j = 0; j < post.conversations.length; j++){
          var conversation = post.conversations[j];
          conversation.show = false;
          if(conversation.requestingUser.fbId.toString() === $rootScope.fbId){
            post.show = conversation.show = true;
          }
        }
      }
    }
  };

  $scope.completed = function(){
    for (var i = 0; i < $scope.posts.length; i++){
      var post = $scope.posts[i];
      if(!post.completed){
        post.show = false;
      }else{
        if(post.fbId === $rootScope.fbId){
          post.show = true;
          for(var j = 0; j < post.conversations.length; j++){
            post.conversations[j].show = true;
          }
        }else{
          for(var k = 0; k < post.conversations.length; k++){
            var conversation = post.conversations[k];
            conversation.show = false;
            if(conversation.requestingUser.fbId.toString() === $rootScope.fbId){
              post.show = conversation.show = true;
            }
          }
        }
      }
    }
  };

  $scope.search = function (post){
    var contains = function(search){
      return _.contains(post.itemName.toLowerCase(), search) ||
             _.contains(post.description.toLowerCase(), search) ||
             _.contains(post.condition.toLowerCase(), search) ||
             _.contains(post.name.toLowerCase(), search);
    };

    if($scope.searchDashboard){
      var search = $scope.searchDashboard.toLowerCase();
      return (contains(search)) ? true : false;
    }else{
      return true;
    }
  };

  $rootScope.conversationModalShow = false;
  $rootScope.toggleConversationModal = function(conversation, post){
    $scope.conversationModalShow = !$scope.conversationModalShow;
    if(conversation){
      $rootScope.setConversationModal(conversation, post);
    }
    $scope.displayButton();
  };

  $rootScope.setConversationModal = function(conversation, post){
    $rootScope.modalConversation = conversation;
    $rootScope.modalPost = post;
  };

  // Display button if the post is not complete and if you are are owner of the post
  $scope.displayButton = function(){
    if(!$rootScope.modalPost.completed){
      if($rootScope.modalPost.fbId === $rootScope.fbId && $rootScope.modalConversation.accepted === null){
        $scope.button = true;
        return;
      }else{
        $scope.button = false;
      }
    }else{
      $scope.button = false;
    }
  };
});
