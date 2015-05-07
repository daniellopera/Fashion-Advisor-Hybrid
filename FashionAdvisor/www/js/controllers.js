//App controllers

angular.module('starter.controllers', [])

.controller('WardrobeCtrl',['$scope','$state','UserManagement','WardrobeManagement','$ionicLoading','$ionicHistory','OutfitManagement', function($scope,$state,UserManagement,WardrobeManagement,$ionicLoading,$ionicHistory,OutfitManagement) {

  $scope.items = WardrobeManagement.getWardrobeOutfits();

  $scope.getClothing = function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
    $state.go('tab.wardrobe_products');
  }

  $scope.redirectOutfitCreation = function(){
    WardrobeManagement.unselectAll();
    OutfitManagement.setClothing([]);
    $state.go('tab.account-wardrobe-select-outfits-clothing');
  }

  $scope.index = function(item){ //Obtención de índice de un producto de la vista
    return WardrobeManagement.indexOfOutfit(item);
  }
}])

.controller('WardrobeProductsCtrl',['$scope','$state','UserManagement','WardrobeManagement','$ionicLoading','$ionicHistory', function($scope,$state,UserManagement,WardrobeManagement,$ionicLoading,$ionicHistory) {

  $scope.items = WardrobeManagement.getWardrobeClothing();

  $scope.getOutfits = function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
    $state.go('tab.wardrobe');   
  }

  $scope.index = function(item){ //Obtención de índice de un producto de la vista
   return WardrobeManagement.indexOfClothing(item);
  }
 }])

.controller('OutfitsClothingSelectionCtrl',['$scope','WardrobeManagement','OutfitManagement','$state','$ionicHistory','$ionicPopup','$timeout',function($scope,WardrobeManagement,OutfitManagement,$state,$ionicHistory,$ionicPopup,$timeout){

  $scope.products = WardrobeManagement.getWardrobeClothing();

  function showAlert(name,msg) {
   var alertPopup = $ionicPopup.alert({
     title: name,
     template: msg
   });
   alertPopup.then(function(res) {
   });
   $timeout(function() {
     alertPopup.close();
   }, 3000);
  };

  $scope.select = function(item){
    
    var index = OutfitManagement.getIndexOfClothing(item);
    if(index==-1){
      var length = OutfitManagement.getClothingLength();
      if(length<10){
        OutfitManagement.addClothingToNewOutfit(item);
        item.selected = "close-round";
      }else{
        showAlert("Selection error","Can't select more than 10 products")
      }
    }else{
      OutfitManagement.removeClothingFromNewOutfitAtIndex(index);
      item.selected = "";
    }
  }

  $scope.completeOutfitCreation = function(){
    var length = OutfitManagement.getClothingLength();
    if(length>1){
      var outfitClothing = OutfitManagement.getClothingOfOutfit();
      $state.go('tab.account-wardrobe-create-outfit');
    }else{
      showAlert("Selection error","You need at least two products to create an outfit")
    }
  }
}])

.controller('OutfitCreationCtrl',['$scope','WardrobeManagement','OutfitManagement','$state','$ionicHistory','UserManagement','$ionicLoading','$ionicPopup','$ionicPopup','$timeout',function($scope,WardrobeManagement,OutfitManagement,$state,$ionicHistory,UserManagement,$ionicLoading,$ionicPopup,$timeout){

  var clothing = OutfitManagement.getClothingOfOutfit();
  $scope.items = clothing;

  function showAlert(name,msg) {
   var alertPopup = $ionicPopup.alert({
     title: name,
     template: msg
   });
   alertPopup.then(function(res) {
   });
   $timeout(function() {
     alertPopup.close();
   }, 3000);
  };

  $scope.createOutfit = function(name,description){
    if(name!=undefined && description!=undefined){
      $ionicLoading.show(); 
      var currentUser = UserManagement.getCurrentUser(); 
      var creationPromise = OutfitManagement.createOutfit(currentUser,name,description);
      creationPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          WardrobeManagement.addOutfitToWardrobe(result.data.id,name,0,0,0,description,OutfitManagement.getClothingOfOutfit());
          OutfitManagement.setClothing([]);
          $state.go('tab.wardrobe');
        }else{
          showAlert("Outfit Error","Couldn't create outfit")
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      });
    }else{
      showAlert("Check name and description","Check name and description to complete outfit creation")
    }
  }
}])

.controller('RegisterCtrl', ['$scope','$state','UserManagement','$ionicLoading','$ionicHistory','WardrobeManagement','$ionicPopup','$timeout',function($scope, $state, UserManagement,$ionicLoading,$ionicHistory,WardrobeManagement,$ionicPopup,$timeout) {

  function showAlert(name,msg) {
   var alertPopup = $ionicPopup.alert({
     title: name,
     template: msg
   });
   alertPopup.then(function(res) {
   });
   $timeout(function() {
     alertPopup.close();
   }, 3000);
  };

  function processRegisterRequest(email,password){
    $ionicLoading.show(); 
    var registerPromise = UserManagement.signup(email,password); 
    registerPromise.then(function(result){
      $ionicLoading.hide(); 
      if(result.status==0){ 
        UserManagement.setCurrentUser(result.data); 
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory(); 
        $state.go('tab.wardrobe'); 
      }else{ 
        showAlert("Register Error","Register unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      showAlert("Fatal Server Error","Server error, try again later.")
    });
  }

  $scope.register = function(email,password1,password2){
    if(email!=undefined && email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
      if(password1!=undefined && password2!=undefined && password1==password2 && password1.length>=6){
        processRegisterRequest(email,password1)
      }else{
        showAlert("Check passwords","Please check your passwords")
      }
    }else{
      showAlert("Check email","Please check your email.")
    }
  };
}])

.controller('SigninCtrl',['$scope','$state','UserManagement','$ionicLoading','$ionicHistory','WardrobeManagement','$ionicPopup','$timeout','FriendManagement',function($scope, $state, UserManagement,$ionicLoading,$ionicHistory,WardrobeManagement,$ionicPopup,$timeout,FriendManagement) {

  function showAlert(name,msg) {
   var alertPopup = $ionicPopup.alert({
     title: name,
     template: msg
   });
   alertPopup.then(function(res) {
   });
   $timeout(function() {
     alertPopup.close();
   }, 3000);
  };

  function getUsersWardrobeClothing(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var updatePromise = WardrobeManagement.updateWardrobeClothing(currentUser); 
    updatePromise.then(
      function(result){
        $ionicLoading.hide(); 
        if(result.status==0){
          WardrobeManagement.setWardrobeClothing(result.data.wardrobe_products);
          getUsersWardrobeOutfits();
        }else{
          showAlert("Wardrobe Error","Couldn't get your clothing")
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      });
  }

  function getUsersWardrobeOutfits(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var updatePromise = WardrobeManagement.updateWardrobeOutfits(currentUser); 
    updatePromise.then(
      function(result){
        $ionicLoading.hide(); 
        if(result.status==0){
          WardrobeManagement.setWardrobeOutfits(result.data.wardrobe_outfits);
          getUsersFriends();
        }else{
          showAlert("Wardrobe Error","Couldn't get your outfits")
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      });
  }

  function getUsersFriends(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var getPromise = FriendManagement.getFollowingUsers(currentUser); 
    getPromise.then(
      function(result){
        $ionicLoading.hide(); 
         if(result.status==0){
          FriendManagement.setFollowingUsers(result.data);
          $state.go('tab.feed');
        }else{
          showAlert("Friendship Error","Couldn't get your followers")
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server -Friendship- Error","Server error, try again later.")
      }); 
  }

  function processLoginRequest(email, password){
    $ionicLoading.show(); 
    var loginPromise = UserManagement.login(email,password); 
    loginPromise.then(function(result){
     $ionicLoading.hide(); 
     if(result.status==0){
       UserManagement.setCurrentUser(result.data);
       $ionicHistory.clearCache();
       $ionicHistory.clearHistory();
       getUsersWardrobeClothing();
     }else{
       showAlert("Login Error","Login unsuccessful.")
     }
   },function(error){
    $ionicLoading.hide(); 
    showAlert("Fatal Server Error","Server error, try again later.")
  });
  }

  $scope.login = function(email,password) {
    if(email!=undefined && email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
      if(password!=undefined && password.length>=6){
        processLoginRequest(email,password);
      }else{
        showAlert("Check password","Please check your password.")
      }
    }else{
      showAlert("Check email","Please check your email.")
    }
  };

  $scope.redirectSignup = function(){
    $state.go('register');
  };
}])

.controller('SearchCtrl', ['$scope','$state','UserManagement','SearchManagement','$ionicLoading','$ionicPopup','$timeout','$ionicHistory', function($scope, $state, UserManagement, SearchManagement, $ionicLoading,$ionicPopup,$timeout,$ionicHistory) {

 function showAlert(name,msg) {
   var alertPopup = $ionicPopup.alert({
     title: name,
     template: msg
   });
   alertPopup.then(function(res) {
   });
   $timeout(function() {
     alertPopup.close();
   }, 3000);
  };

 var currentUser = UserManagement.getCurrentUser();
 $ionicLoading.show(); 
 var colorPromise = SearchManagement.getColors(currentUser);
 colorPromise.then(function(result){
  $ionicLoading.hide(); 
  if(result.status==0){
    $scope.colors = result.data.colors; 
  }else{
    showAlert("Search Error","Search unsuccessful")
  }
},function(error){
  $ionicLoading.hide();
  showAlert("Fatal Server Error","Server error, try again later.")
});

 $scope.getSelectedBrand = function(){
  return SearchManagement.getBrand();
 }  

$scope.selectColor = function(color){
  SearchManagement.selectColor(color);
}

$scope.advancedSearch = function(searchTerm){
  $ionicLoading.show(); 
  var currentUser = UserManagement.getCurrentUser();
  var brand = SearchManagement.getBrand();
  var color = SearchManagement.getColor();
  var advsearchPromise = SearchManagement.advancedSearch(currentUser,color,brand,searchTerm);
  advsearchPromise.then(function(result){
    $ionicLoading.hide(); 
    if(result.status==0){
      SearchManagement.setItems(result.data.products); 
      $scope.items = result.data.products; 
    }else{
      showAlert("Search Error","Search unsuccessful")
    }
  },function(error){
    $ionicLoading.hide();
    showAlert("Fatal Server Error","Server error, try again later.")
  });
}

$scope.index = function(item){ 
  return SearchManagement.indexOfProduct(item);
}

$scope.searchIcon = function(item){ 
   if(item.in_wardrobe==true){
    $scope.addToWadrobeStyle = {'display':'none'};
    return "heart";
  }else{
    return "bag";
  }
}

$scope.getOutfits = function(){
  $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
  $state.go('tab.search-outfits');
}

$scope.getPeople = function(){
  $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
  $state.go('tab.friends-search');
}

}])

.controller('AdvancedSearchCtrl', ['$scope','$state','UserManagement','SearchManagement','$ionicLoading','$ionicPopup','$timeout',function($scope, $state, UserManagement, SearchManagement, $ionicLoading,$ionicPopup,$timeout) {

}])

.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','SearchManagement','UserManagement','WardrobeManagement','$ionicLoading','$ionicPopup','$timeout','$ionicModal', '$ionicSlideBoxDelegate',function($scope, $state, $stateParams,SearchManagement,UserManagement,WardrobeManagement,$ionicLoading,$ionicPopup,$timeout,$ionicModal, $ionicSlideBoxDelegate) {

     var item  = SearchManagement.getProductAtIndex($stateParams.itemId); //Obtención de item específico
     $scope.item = item; //Asignación de item a variable en la vista
     

     $scope.getColors = function(item){
        var string = "";
        var colors = item.colors
        if(colors.length>0){
          string += colors[0].name
        }
        for(i = 1; i < colors.length;i++){
          string += ", "
          string += colors[i].name
        }
        return string;
     }

     $scope.getSizes = function(item){
        var string = "";
        var sizes = item.sizes
        if(sizes.length>0){
          string += sizes[0].name
        }
        for(i = 1; i < sizes.length;i++){
          string += ", "
          string += sizes[i].name
        }
        return string;
     }

     $scope.getCategories = function(item){
        var string = "";
        var categories = item.categories
        if(categories.length>0){
          string += categories[0].name
        }
        for(i = 1; i < categories.length;i++){
          string += ", "
          string += categories[i].name
        }
        return string;
     }

     function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
      };

     $scope.producticon = function(item){ //Estilo en caso de tener la prenda en el guardaropa
       if(item.in_wardrobe==true){
        $scope.addToWadrobeStyle = {'display':'none'};
        return "heart";
      }else{
        return "bag";
      }
    }

     $scope.addToWardrobe = function(item){ //Gestión de solicitud de adición de item (producto) a colección personal (closet)
       var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
       $ionicLoading.show(); //Mostrar loader
       var addToWardrobePromise = WardrobeManagement.addClothingToWardrobe(item,currentUser); //Llamada a servicio de adición a guardarropa
       addToWardrobePromise.then(function(result){
            $ionicLoading.hide(); //Ocultar loader
            if(result.status==0){ //Adición exitosa de producto a guardarropa
              item.in_wardrobe = true;
              $scope.producticon(item); //Setear estilo de prenda en guardaropa
              WardrobeManagement.addProductToClothing(item);
            }else{ //Adición de producto sin éxito
              showAlert("Adding Error","Clothing adding unsuccessful")
            }
          },function(error){
            $ionicLoading.hide();
            showAlert("Fatal Server Error","Server error, try again later.")
          });
     }

    function getImages(item){
      var images = []
      var alternateImages = item.alternateImages
      for(i = 1; i < alternateImages.length && i<8;i++){
        images.push(alternateImages[i].sizes.Large)
      }
      images.push(item.image.sizes.Large)
      return images;
    }

    $scope.images = getImages(item);

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

  }])

.controller('WardrobeClothingDetailsCtrl', ['$scope','WardrobeManagement','$stateParams',function($scope,WardrobeManagement,$stateParams) {
    var item  = WardrobeManagement.getClothingAtIndex($stateParams.itemId); //Obtención de item específico
    $scope.item = item;
   
    function getImages(item){
      var images = []
      var alternateImages = item.alternateImages
      for(i = 1; i < alternateImages.length && i<8;i++){
        images.push(alternateImages[i].sizes.Large)
      }
      images.push(item.image.sizes.Large)
      return images;
    }

    $scope.images = getImages(item);

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };


     $scope.getColors = function(item){
        var string = "";
        var colors = item.colors
        if(colors.length>0){
          string += colors[0].name
        }
        for(i = 1; i < colors.length;i++){
          string += ", "
          string += colors[i].name
        }
        return string;
     }

     $scope.getSizes = function(item){
        var string = "";
        var sizes = item.sizes
        if(sizes.length>0){
          string += sizes[0].name
        }
        for(i = 1; i < sizes.length;i++){
          string += ", "
          string += sizes[i].name
        }
        return string;
     }

     $scope.getCategories = function(item){
        var string = "";
        var categories = item.categories
        if(categories.length>0){
          string += categories[0].name
        }
        for(i = 1; i < categories.length;i++){
          string += ", "
          string += categories[i].name
        }
        return string;
     }

  }])

.controller('OutfitDetailsCtrl', ['$scope','WardrobeManagement','$stateParams','OutfitManagement','$ionicLoading','$ionicPopup','$timeout','UserManagement',function($scope,WardrobeManagement,$stateParams,OutfitManagement,$ionicLoading,$ionicPopup,$timeout,UserManagement) {
    var item  = WardrobeManagement.getOutfitAtIndex($stateParams.itemId); //Obtención de item específico
    $scope.item = item;
    var products = []
    var clothing = WardrobeManagement.getWardrobeClothing();
    for(i = 0; i < item.products.length; i++){
      for(j = 0; j < clothing.length;j++){
        if(item.products[i].id==clothing[j].id){
          products.push(clothing[j])
        }
      }
    }
    $scope.products = products

    $scope.indexProduct = function(item){ //Obtención de índice de un producto de la vista
     var index = WardrobeManagement.indexOfClothing(item);
     return index;
    }

    $scope.indexOutfit = function(item){ //Obtención de índice de un producto de la vista
     var index = WardrobeManagement.indexOfOutfit(item);
     return index;
    }

    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

    $scope.like = function(rating,outfit){
      var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show(); //Mostrar loader
      var likePromise = OutfitManagement.likeOutfit(rating,outfit,currentUser)
      likePromise.then(function(result){
        $ionicLoading.hide()
        if(result.status==0){
          $scope.item.likes = result.data.likes
          $scope.item.dislikes = result.data.dislikes
        }else{
          showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }
 }])

.controller('FriendsCtrl', ['$scope','$state','FriendManagement',function($scope,$state,FriendManagement) {
  
  $scope.friends = FriendManagement.getFollowing();

  $scope.redirectUserSearch = function(){
    $state.go('tab.friends-search');
  }

  $scope.index = function(friend){
    return FriendManagement.getIndexOfFollowing(friend);
  }

}])

.controller('FriendDetailSearchCtrl', ['$scope','FriendManagement','$stateParams','$ionicLoading','UserManagement','$ionicPopup','$timeout',function($scope,FriendManagement,$stateParams,$ionicLoading,UserManagement,$ionicPopup,$timeout) {
    
    function usericon(friend){ //Estilo en caso de tener la prenda en el guardaropa
       if(friend.following==true){
          $scope.followUserStyle = {'display':'none'};
       }
    }

    var user  = FriendManagement.getFriendAtIndex($stateParams.friendId); //Obtención de item específico
    $scope.friend = user;
    var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
    $ionicLoading.show()
    var profilePromise = FriendManagement.getProfile(user.id,currentUser);
    profilePromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        $scope.items = result.data
        usericon(user)
      }else{
        showAlert("Profile Error","Profile reading unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      showAlert("Fatal Server Error","Server error, try again later.")
    });

    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

    $scope.follow = function(friend){
      $ionicLoading.show();
      var currentUser = UserManagement.getCurrentUser();
      var followPromise = FriendManagement.followFriend(friend,currentUser);
      followPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          friend.following = true 
          usericon(friend)
          FriendManagement.addFriend(friend);
        }else{
          showAlert("Follow Error","User following unsuccessful")
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('FriendDetailCtrl', ['$scope','FriendManagement','$ionicLoading','UserManagement','$ionicPopup','$timeout','SearchManagement','$stateParams',function($scope,FriendManagement,$ionicLoading,UserManagement,$ionicPopup,$timeout,SearchManagement,$stateParams) {
  var user  = FriendManagement.getFollowingFriendAtIndex($stateParams.friendId); //Obtención de item específico
  $scope.friend = user;  

  var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
    $ionicLoading.show()
    var profilePromise = FriendManagement.getProfile(user.id,currentUser);
    profilePromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        $scope.items = result.data
      }else{
        showAlert("Profile Error","Profile reading unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      showAlert("Fatal Server Error","Server error, try again later.")
    });
}])

.controller('FriendsSearchCtrl', ['$scope','FriendManagement','$ionicLoading','UserManagement','$ionicPopup','$timeout','SearchManagement','$ionicHistory','$state',function($scope,FriendManagement,$ionicLoading,UserManagement,$ionicPopup,$timeout,SearchManagement,$ionicHistory,$state) {
  
  function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
  };

  $scope.searchUser = function(searchTerm){
    var currentUser = UserManagement.getCurrentUser();
    $ionicLoading.show();
    var searchPromise = SearchManagement.searchUsers(searchTerm,currentUser);
    searchPromise.then(function(result){
      $ionicLoading.hide();
      if(result.status==0){
        users = result.data.users;
        $scope.friends = users
        FriendManagement.setFriends(users)
      }else{
        showAlert("Search Error","Search unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      showAlert("Fatal Server Error","Server error, try again later.")
    });
  }

  $scope.index = function(friend){
    return FriendManagement.getIndexOfFriend(friend);
  }

  //-------------------------//
  $scope.getOutfits = function(){
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
      });
    $state.go('tab.search-outfits');
  }

  $scope.getClothing = function(){
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
      });
    $state.go('tab.search');
  }

}])

.controller('WardrobeCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement){
    
    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

    var outfitId = WardrobeManagement.getOutfitAtIndex($stateParams.outfitId)
    if(outfitId==-1){
      outfitId = SearchManagement.getOutfitAtIndex($stateParams.outfitId)
    }
    outfitId = outfitId.id
    var currentUser = UserManagement.getCurrentUser();
    $ionicLoading.show();
    var commentPromise = OutfitManagement.getOutfitComments(outfitId,currentUser)
    commentPromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        OutfitManagement.setComments(result.data.outfit_comments);
        $scope.messages = OutfitManagement.getComments()
      }else{
        showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      showAlert("Fatal Server Error","Server error, try again later.")
    })

    $scope.comment = function(commentTerm){
      var currentUser = UserManagement.getCurrentUser();
      var commentPromise = OutfitManagement.commentOutfit(outfitId,commentTerm,currentUser)
      $ionicLoading.show();
      commentPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          OutfitManagement.addComment(result.data[0])
        }else{
          showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('FriendOutfitDetailCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading){
  
  function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

  var outfitId = $stateParams.outfitId
  var currentUser = UserManagement.getCurrentUser();    
  var outfitPromise = OutfitManagement.getOutfitById(outfitId,currentUser)

  $ionicLoading.show();
  outfitPromise.then(function(result){
    $ionicLoading.hide();
    if(result.status==0){
      $scope.item = result.data.outfit
      $scope.products = result.data.outfit_products
      SearchManagement.addOutfit(result.data.outfit)
    }else{
      showAlert("Outfit Error","Outfit unsuccessful")   
    }
  },function(error){
    $ionicLoading.hide();
    showAlert("Fatal Server Error","Server error, try again later.")    
  })

  $scope.like = function(rating,outfit){
      var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show(); //Mostrar loader
      var likePromise = OutfitManagement.likeOutfit(rating,outfit,currentUser)
      likePromise.then(function(result){
        $ionicLoading.hide()
        if(result.status==0){
          $scope.item.likes = result.data.likes
          $scope.item.dislikes = result.data.dislikes
        }else{
          showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }

    $scope.indexOutfit = function(item){ //Obtención de índice de un producto de la vista
      var index = SearchManagement.indexOfOutfit(item);
      return index;
    }
}])

.controller('FriendsOutfitsCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading){
  
    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

    var outfitId = SearchManagement.getOutfitAtIndex($stateParams.outfitId).id
    var currentUser = UserManagement.getCurrentUser();
    $ionicLoading.show();
    var commentPromise = OutfitManagement.getOutfitComments(outfitId,currentUser)
    commentPromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        OutfitManagement.setComments(result.data.outfit_comments);
        $scope.messages = OutfitManagement.getComments()
      }else{
        showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      showAlert("Fatal Server Error","Server error, try again later.")
    })

    $scope.comment = function(commentTerm){
      var currentUser = UserManagement.getCurrentUser();
      var commentPromise = OutfitManagement.commentOutfit(outfitId,commentTerm,currentUser)
      $ionicLoading.show();
      commentPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          OutfitManagement.addComment(result.data[0])
        }else{
          showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('SearchOutfitsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','$ionicHistory',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,$ionicHistory){
  
  var clothing = OutfitManagement.getClothingOfOutfit();
  $scope.products = clothing;

  $scope.getClothing = function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
    $state.go('tab.search');
  }

  $scope.getPeople = function(){
  $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
  $state.go('tab.friends-search');
  }

  $scope.recommend = function(tag){
    var currentUser = UserManagement.getCurrentUser();
    var recommendPromise = OutfitManagement.recommendOutfits(tag,currentUser);
    $ionicLoading.show();
    recommendPromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        $scope.items = result.data
      }else{
        showAlert("Recommend Error","Recommend unsuccessful")  
      }
    },function(error){
      $ionicLoading.hide()
      showAlert("Fatal Server Error","Server error, try again later.")
    })  
  }

  $scope.select = function(){
    $state.go('tab.search-select-clothing')
  }

  $scope.selectedClothing = function(position){
    var array = OutfitManagement.getClothingOfOutfit();
    var item = array[position]
    if(item==null){
      return "https://s-media-cache-ak0.pinimg.com/236x/02/08/fa/0208fa1220e7c078aee55ba410618bb1.jpg"
    }else{
      return item.image.sizes.Large.url;
    }
  }
  
}])

.controller('SearchSelectClothingCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','$ionicHistory','WardrobeManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,$ionicHistory,WardrobeManagement){

  $scope.products = WardrobeManagement.getWardrobeClothing();

  function showAlert(name,msg) {
   var alertPopup = $ionicPopup.alert({
     title: name,
     template: msg
   });
   alertPopup.then(function(res) {
   });
   $timeout(function() {
     alertPopup.close();
   }, 3000);
  };

  $scope.select = function(item){
    var index = OutfitManagement.getIndexOfClothing(item);
    if(index==-1){
      var length = OutfitManagement.getClothingLength();
      if(length<3){
        OutfitManagement.addClothingToNewOutfit(item);
        item.selected = "close-round";
      }else{
        showAlert("Selection error","Can't select more than 3 products")
      }
    }else{
      OutfitManagement.removeClothingFromNewOutfitAtIndex(index);
      item.selected = "";
    }
  }
}])

.controller('SearchOutfitDetailCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading){
  
  function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

  var outfitId = $stateParams.outfitId
  var currentUser = UserManagement.getCurrentUser();    
  var outfitPromise = OutfitManagement.getOutfitById(outfitId,currentUser)

  $ionicLoading.show();
  outfitPromise.then(function(result){
    $ionicLoading.hide();
    if(result.status==0){
      $scope.item = result.data.outfit
      $scope.products = result.data.outfit_products
      SearchManagement.addOutfit(result.data.outfit)
    }else{
      showAlert("Outfit Error","Outfit unsuccessful")   
    }
  },function(error){
    $ionicLoading.hide();
    showAlert("Fatal Server Error","Server error, try again later.")    
  })

  $scope.like = function(rating,outfit){
      var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show(); //Mostrar loader
      var likePromise = OutfitManagement.likeOutfit(rating,outfit,currentUser)
      likePromise.then(function(result){
        $ionicLoading.hide()
        if(result.status==0){
          $scope.item.likes = result.data.likes
          $scope.item.dislikes = result.data.dislikes
        }else{
          showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }

    $scope.indexOutfit = function(item){ //Obtención de índice de un producto de la vista
      var index = SearchManagement.indexOfOutfit(item);
      return index;
    }
}])

.controller('SearchCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement){
    
    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

    outfitId = SearchManagement.getOutfitAtIndex($stateParams.outfitId)
    
    outfitId = outfitId.id
    var currentUser = UserManagement.getCurrentUser();
    $ionicLoading.show();
    var commentPromise = OutfitManagement.getOutfitComments(outfitId,currentUser)
    commentPromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        OutfitManagement.setComments(result.data.outfit_comments);
        $scope.messages = OutfitManagement.getComments()
      }else{
        showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      showAlert("Fatal Server Error","Server error, try again later.")
    })

    $scope.comment = function(commentTerm){
      var currentUser = UserManagement.getCurrentUser();
      var commentPromise = OutfitManagement.commentOutfit(outfitId,commentTerm,currentUser)
      $ionicLoading.show();
      commentPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          OutfitManagement.addComment(result.data[0])
        }else{
          showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])


.controller('FeedCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement){
    
    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };
}])

.controller('InspirationCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement){
    
    function showAlert(name,msg) {
       var alertPopup = $ionicPopup.alert({
         title: name,
         template: msg
       });
       alertPopup.then(function(res) {
       });
       $timeout(function() {
         alertPopup.close();
       }, 3000);
    };

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
}])

.controller('AccountCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement){
  $scope.logout = function(){
    UserManagement.signout();
    OutfitManagement.setClothing([]);
    SearchManagement.selectBrand({});
    SearchManagement.selectColor({});
    $state.go('signin');
  }

  $scope.redirectToMyOutfits = function(){
    $state.go('tab.account-wardrobe');  
  }


  $scope.redirectToMyClothing = function(){
    $state.go('tab.account-clothing');  
  }

  $scope.redirectToFollowing = function(){
    $state.go('tab.account-friends'); 
  }
  
}])