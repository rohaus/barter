angular.module('barterApp')
.controller('MapCtrl', function ($scope, $location, $http, $rootScope, MapService){
  $scope.initialize = function(){
    MapService.initialize();
  };

  $scope.postRedirect = function(){
    $location.path('/post');
  };

  $scope.convRedirect = function(){
    $location.path('/conversations');
  };

  $scope.logout = function(){
    $http.get('/logout')
    .success(function(data, status, headers, config){
      console.log("Attempting to logout");
    });
  };

  $scope.newConversationDisplay = false;

  $rootScope.displayNewConversation = function(){
    if(!$scope.newConversationDisplay){
      $scope.newConversationDisplay = true;
    }
  };

  $scope.sendNewConversation = function(recipient){
    $scope.data = {
      'requestingUser': {
        'fbId': $rootScope.fbId,
        'name': $rootScope.name
      },
      'message': $scope.newConversation,
      'from': $rootScope.name,
      '_id': recipient._id
    };
    $http.post('/sendNewConversation', $scope.data)
    .success(function(data, status, headers, config){
      console.log("SUCCESS!");
      $scope.newConversation = '';
    })
    .error(function(data, status){
      console.log("ERROR :(");
    });
  };

  $scope.search = function (post){
    if($scope.searchText){
      var searchText = $scope.searchText.toLowerCase();
      if (post.itemName.toLowerCase().indexOf(searchText)!=-1 ||
        post.description.toLowerCase().indexOf(searchText)!=-1 ||
        post.condition.toLowerCase().indexOf(searchText)!=-1 ||
        post.name.toLowerCase().indexOf(searchText)!=-1) {
      return true;
      }
      return false;
    }
    return true;
  };

});
