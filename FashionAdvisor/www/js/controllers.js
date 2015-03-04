angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('SigninCtrl', ['$scope','$state','LoginService',function($scope, $state, LoginService) {
    $scope.login = function(user) {
        var loginPromise = LoginService.login(user.email,user.password);
        loginPromise.then(function(result){
             alert(JSON.stringify(result));
             $state.go('tab.dash');
        });
    };
}])

.controller('ChatsCtrl', function($scope, Chats, LoginService) {
  var userData = LoginService.getUser();
  var myDataPromise = Chats.getData();
  myDataPromise.then(function(result) {  // this is only run after $http completes
       $scope.chats = result;
    });
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.getty($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
