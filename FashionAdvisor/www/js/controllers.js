angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('RegisterCtrl', ['$scope','$state','RegisterService','LoginService',function($scope, $state, RegisterService, LoginService) {
    $scope.register = function(email,password1,password2){
      if(password1==password2){
        var registerPromise = RegisterService.signup(email,password1,password2);
        registerPromise.then(function(result){
          alert(JSON.stringify(result));
          if(result.auth_token!=null){
            //Register succesful
            LoginService.setCurrentUser(result);
            $state.go('tab.dash');
          }else{
            //Register unsuccesful
          }
        });
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

   $scope.detail = function(item){
      return SearchService.indexOfItem(item);
   }
}])

.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','SearchService',function($scope, $state, $stateParams,SearchService) {
    $scope.item = SearchService.getItem($stateParams.itemId);
}])

.controller('ChatsCtrl', function($scope, Chats, LoginService) {
    
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

.controller('AccountCtrl', ['$scope','$state','LoginService',function($scope, $state, LoginService){
  $scope.settings = {
    enableFriends: true
  };
}])
