angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('RegisterCtrl', ['$scope','$state','RegisterService',function($scope, $state, RegisterService) {
    $scope.register = function(email,password1,password2){
      if(password1==password2){
        var registerPromise = RegisterService.signup(email,password1);
        registerPromise.then(function(result){
          alert(JSON.stringify(result));
          $state.go('tab.dash');
        });
      }else{
        //Passwords don't match
      }
    }
}])

.controller('SigninCtrl', ['$scope','$state','LoginService',function($scope, $state, LoginService) {
    $scope.login = function(email,password) {
        //Call login service
        var loginPromise = LoginService.login(email,password);
        loginPromise.then(function(result){
             alert(JSON.stringify(result));
             if(result.auth_token!=null){
                //Login succesful
                $state.go('tab.dash');
             }else{
                //Login unsuccesful
             }
        });
    };
    $scope.signup = function(){
      $state.go('register');
    }
}])

.controller('SearchCtrl', ['$scope','$state','LoginService','SearchService',function($scope, $state, LoginService, SearchService) {
   var currentUser = LoginService.getCurrentUser();
   $scope.search = function(searchTerm){
      var searchPromise = SearchService.search(currentUser,searchTerm);
      searchPromise.then(function(result){
          $scope.items = result;
      });
   }
}])

.controller('ChatsCtrl', function($scope, Chats, LoginService) {
  /*var userData = LoginService.getUser();
  var myDataPromise = Chats.getData();
  myDataPromise.then(function(result) {  // this is only run after $http completes
       $scope.chats = result;
    });
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }*/
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
