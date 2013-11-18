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
      $scope.yourPosts();
    })
    .error(function(data, status, headers, config){
      console.log("Error fetching messages");
    });
  };

  $scope.deleteConversation = function(conversation, post){
    if(!confirm("Are you sure you want to delete the conversation?")){
      return;
    }
    $scope.data = {
      _id: conversation._id
    };
    $http.post('/deleteConversation', $scope.data)
    .success(function(data, status, headers, config){
      console.log("Success deleting conversation");
      $scope.toggleConversationModal();
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
    if(!confirm("Are you sure you want to delete the post?")){
      return;
    }
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

  $scope.respondToBarter = function(conversation, post, type){
    $scope.data = {
      _id: conversation._id
    };
    $http.post('/'+type, $scope.data)
    .success(function(data, status, headers, config){
      console.log("post to "+type+" accepted");
      post.completed = true;
      $scope.toggleConversationModal();
    })
    .error(function(data, status, headers, config){
      console.log("post to "+type+" rejected");
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
          if(conversation.requestingUser.fbId.toString() === $rootScope.fbId){
            post.show = conversation.show = true;
          }else{
            conversation.show = false;
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
            if(conversation.requestingUser.fbId.toString() === $rootScope.fbId){
              post.show = conversation.show = true;
            }else{
              conversation.show = false;
            }
          }
        }
      }
    }
  };

  $scope.search = function (post){
    if($scope.searchDashboard){
      var searchDashboard = $scope.searchDashboard.toLowerCase();
      if (post.itemName.toLowerCase().indexOf(searchDashboard)!=-1 ||
        post.description.toLowerCase().indexOf(searchDashboard)!=-1 ||
        post.condition.toLowerCase().indexOf(searchDashboard)!=-1 ||
        post.name.toLowerCase().indexOf(searchDashboard)!=-1) {
      return true;
      }
      return false;
    }
    return true;
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

  $scope.displayButton = function(){
    if(!$rootScope.modalPost.completed){
      if($rootScope.modalPost.fbId === $rootScope.fbId){
        $scope.button = true;
        return;
      }
      $scope.button = false;
    }
  };
});
