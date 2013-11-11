angular.module('barterApp')
  .controller('ConvCtrl', function($scope, $location, $http, $rootScope){
    $scope.msgShow = true;
    $scope.convShow = true;
    $scope.postShow = true;

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
          $scope.all();
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

    $scope.deleteConversation = function(conversation, post){
      $scope.data = {
        _id: conversation._id
      };
      $http.post('/deleteConversation', $scope.data)
      .success(function(data, status, headers, config){
        console.log("success deleting conversation!");
        var length = post.conversations.length;
        for(var i = 0; i < length; i++){
          if (post.conversations[i]._id === $scope.data._id){
            post.conversations.splice(i,1);
            break;
          }
        }
      })
      .error(function(data, status, headers, config){
        console.log("error deleting conversation");
      });
    };

    $scope.acceptBarter = function(conversation){
      $scope.data = {
        _id: conversation._id
      };
      $http.post('/acceptBarter', $scope.data)
      .success(function(data, status, headers, config){
        console.log("barter accepted!");
      })
      .error(function(data, status, headers, config){
        console.log("error accepting barter");
      });
    };

    $scope.rejectBarter = function(conversation){
      $scope.data = {
        _id: conversation._id
      };
      $http.post('/rejectBarter', $scope.data)
      .success(function(data, status, headers, config){
        console.log("barter rejected!");
      })
      .error(function(data, status, headers, config){
        console.log("error rejecting barter");
      });
    };

    $scope.deletePost = function(post, posts){
      $scope.data = {
        _id: post._id
      };
      $http.post('/deletePost', $scope.data)
      .success(function(data, status, headers, config){
        console.log("post deleted!");
        var length = posts.length;
        for (var i = 0; i < length; i++){
          if (posts[i]._id === $scope.data._id){
            posts.splice(i,1);
            break;
          }
        }
      })
      .error(function(data, status, headers, config){
        console.log("error deleting post");
      });
    };

    $scope.all = function(){
      for (var i = 0; i < $scope.posts.length; i++){
        var post = $scope.posts[i];
        post.show = true;
        for (var j = 0; j < post.conversations.length; j++){
          var conversation = post.conversations[j];
          conversation.show = true;
        }
      }
    };

    $scope.accepted = function(){
      for (var i = 0; i < $scope.posts.length; i++){
        var post = $scope.posts[i];
        if (post.completed){
          post.show = true;
        }else{
          post.show = false;
        }
        for (var j = 0; j < post.conversations.length; j++){
          var conversation = post.conversations[j];
          if(conversation.accepted){
            conversation.show = true;
          }else{
            conversation.show = false;
          }
        }
      }
    };

    $scope.pending = function(){
      for (var i = 0; i < $scope.posts.length; i++){
        var post = $scope.posts[i];
        if (post.completed){
          post.show = false;
        }else{
          post.show = true;
        }
        for (var j = 0; j < post.conversations.length; j++){
          var conversation = post.conversations[j];
          if(conversation.accepted === null){
            conversation.show = true;
          }else{
            conversation.show = false;
          }
        }
      }
    };

    $scope.completed = function(){
      for (var i = 0; i < $scope.posts.length; i++){
        var post = $scope.posts[i];
        if (post.completed){
          post.show = true;
        }else{
          post.show = false;
        }
        for (var j = 0; j < post.conversations.length; j++){
          var conversation = post.conversations[j];
          if(conversation.accepted !== null){
            conversation.show = true;
          }else{
            conversation.show = false;
          }
        }
      }
    };

    $scope.yourPosts = function(){
      for (var i = 0; i < $scope.posts.length; i++){
        var post = $scope.posts[i];
        if (post.fbId === $rootScope.fbId){
          post.show = true;
        }else{
          post.show = false;
        }
      }
    };

    $scope.yourRequests = function(){
      for (var i = 0; i < $scope.posts.length; i++){
        var post = $scope.posts[i];
        if (post.fbId === $rootScope.fbId){
          post.show = false;
        }else{
          post.show = true;
        }
      }
    };


  });
