//App controllers

angular.module('starter.controllers', [])

.controller('WardrobeCtrl',['$scope','$state','UserManagement','WardrobeManagement','$ionicLoading','$ionicHistory','OutfitManagement','AlertingSystem', function($scope,$state,UserManagement,WardrobeManagement,$ionicLoading,$ionicHistory,OutfitManagement,AlertingSystem) {

  function getUsersWardrobeOutfits(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var updatePromise = WardrobeManagement.updateWardrobeOutfits(currentUser); 
    updatePromise.then(
      function(result){
        $ionicLoading.hide(); 
        if(result.status==0){
          WardrobeManagement.setWardrobeOutfits(result.data.wardrobe_outfits);
          $scope.items = WardrobeManagement.getWardrobeOutfits();
        }else{
          AlertingSystem.showAlert("Wardrobe Error","Couldn't get your outfits")
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      });
  }

  getUsersWardrobeOutfits();

  $scope.getClothing = function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
    });
    $state.go('tab.wardrobe_products');
  }

  $scope.redirectOutfitCreation = function(){
    WardrobeManagement.unselectAll();
    OutfitManagement.setClothing([]);
    $state.go('tab.account-wardrobe-create-outfit');
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

.controller('OutfitsClothingSelectionCtrl',['$scope','WardrobeManagement','OutfitManagement','$state','$ionicHistory','$ionicPopup','$timeout','AlertingSystem',function($scope,WardrobeManagement,OutfitManagement,$state,$ionicHistory,$ionicPopup,$timeout,AlertingSystem){

  $scope.products = WardrobeManagement.getWardrobeClothing();

  $scope.select = function(item){
    
    var index = OutfitManagement.getIndexOfClothing(item);
    if(index==-1){
      var length = OutfitManagement.getClothingLength();
      if(length<6){
        OutfitManagement.addClothingToNewOutfit(item);
        item.style = "selected_style";
      }else{
        showAlert("Selection error","Can't select more than 6 products")
      }
    }else{
      OutfitManagement.removeClothingFromNewOutfitAtIndex(index);
      item.style = "";
    }
  }

  $scope.completeOutfitCreation = function(){
    var length = OutfitManagement.getClothingLength();
    if(length>1){
      var outfitClothing = OutfitManagement.getClothingOfOutfit();
      $state.go('tab.account-wardrobe-create-outfit');
    }else{
      AlertingSystem.showAlert("Selection error","You need at least two products to create an outfit")
    }
  }
}])

.controller('OutfitCreationCtrl',['$scope','WardrobeManagement','OutfitManagement','$state','$ionicHistory','UserManagement','$ionicLoading','$ionicPopup','$ionicPopup','$timeout','AlertingSystem',function($scope,WardrobeManagement,OutfitManagement,$state,$ionicHistory,UserManagement,$ionicLoading,$ionicPopup,$timeout,AlertingSystem){

  var clothing = OutfitManagement.getClothingOfOutfit();
  $scope.items = clothing;

  $scope.createOutfit = function(name,description,tags){
    if(name!=undefined && description!=undefined && tags!=undefined && tags.match(/^(#([A-z|0-9])+( )*)+/)){
      $ionicLoading.show(); 
      var currentUser = UserManagement.getCurrentUser(); 
      var creationPromise = OutfitManagement.createOutfit(currentUser,name,description,tags);
      creationPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          WardrobeManagement.addOutfitToWardrobe(result.data.outfitid,name,0,0,0,description,OutfitManagement.getClothingOfOutfit());
          OutfitManagement.setClothing([]);
          UserManagement.getCurrentUser().outfits = currentUser.outfits+1;
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
          });
          $state.go('tab.account');
        }else{
          AlertingSystem.showAlert("Outfit Error","Couldn't create outfit")
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      });
    }else{
      AlertingSystem.showAlert("Check name and description","Check name and description to complete outfit creation")
    }
  }

  $scope.select = function(){
    $state.go('tab.account-wardrobe-select-outfits-clothing')
  }

  $scope.selectedClothing = function(position){
    var array = OutfitManagement.getClothingOfOutfit();
    var item = array[position]
    if(item==null){
      return "http://www.astroscu.unam.mx/cursos/esaobela/Iconos/1305530398_6.png"
    }else{
      return item.image.sizes.Large.url;
    }
  }

}])

//RegisterCtrl ready
.controller('RegisterCtrl', ['$scope','$state','UserManagement','$ionicLoading','$ionicHistory','WardrobeManagement','$ionicPopup','$timeout','AlertingSystem',function($scope, $state, UserManagement,$ionicLoading,$ionicHistory,WardrobeManagement,$ionicPopup,$timeout,AlertingSystem) {

  function processRegisterRequest(username,email,password){
    $ionicLoading.show(); 
    var registerPromise = UserManagement.signup(username,email,password); 
    registerPromise.then(function(result){
      $ionicLoading.hide(); 
      if(result.status==0){ 
        UserManagement.setCurrentUser(result.data); 
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory(); 
        $state.go('tab.feed'); 
      }else{ 
        AlertingSystem.showAlert("Register Error","Register unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
    });
  }

  $scope.register = function(username,email,password1,password2){
    if(username!=undefined){
      if(email!=undefined && email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
        if(password1!=undefined && password2!=undefined && password1==password2 && password1.length>=6){
          processRegisterRequest(username,email,password1)
        }else{
          AlertingSystem.showAlert("Check passwords","Please check your passwords")
        }
      }else{
        AlertingSystem.showAlert("Check email","Please check your email.")
      }
    }else{
      AlertingSystem.showAlert("Check username","Please check your username.")
    }
  };
}])


.controller('SigninCtrl',['$scope','$state','UserManagement','$ionicLoading','$ionicHistory','WardrobeManagement','$ionicPopup','$timeout','FriendManagement','AlertingSystem',function($scope, $state, UserManagement,$ionicLoading,$ionicHistory,WardrobeManagement,$ionicPopup,$timeout,FriendManagement,AlertingSystem) {

  function processLoginRequest(email, password){
    $ionicLoading.show(); 
    var loginPromise = UserManagement.login(email,password); 
    loginPromise.then(function(result){
     $ionicLoading.hide(); 
     if(result.status==0){
       UserManagement.setCurrentUser(result.data);
       $ionicHistory.clearCache();
       $ionicHistory.clearHistory();
       $state.go('tab.feed');
     }else{
       AlertingSystem.showAlert("Login Error","Login unsuccessful.")
     }
   },function(error){
    $ionicLoading.hide(); 
    AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
  });
  }

  $scope.login = function(email,password) {
    if(email!=undefined && email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
      if(password!=undefined && password.length>=6){
        processLoginRequest(email,password);
      }else{
        AlertingSystem.showAlert("Check password","Please check your password.")
      }
    }else{
      AlertingSystem.showAlert("Check email","Please check your email.")
    }
  };

  $scope.redirectSignup = function(){
    $state.go('register');
  };
}])

.controller('SearchCtrl', ['$scope','$state','UserManagement','SearchManagement','$ionicLoading','$ionicPopup','$timeout','$ionicHistory','AlertingSystem', function($scope, $state, UserManagement, SearchManagement, $ionicLoading,$ionicPopup,$timeout,$ionicHistory,AlertingSystem) {

 var currentUser = UserManagement.getCurrentUser();
 $ionicLoading.show(); 
 var colorPromise = SearchManagement.getColors(currentUser);
 colorPromise.then(function(result){
  $ionicLoading.hide(); 
  if(result.status==0){
    $scope.colors = result.data.colors; 
  }else{
    AlertingSystem.showAlert("Search Error","Search unsuccessful")
  }
},function(error){
  $ionicLoading.hide();
  AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
});

$scope.selectColor = function(color){
  SearchManagement.selectColor(color);
}

$scope.selectCategory = function(category){
  SearchManagement.selectCategory(category);
}

$scope.advancedSearch = function(searchTerm){
  $ionicLoading.show(); 
  var currentUser = UserManagement.getCurrentUser();
  var category = SearchManagement.getSelectedCategory();
  if(searchTerm==undefined){
    searchTerm = "";
  }
  searchTerm = category + " " + searchTerm;
  var color = SearchManagement.getColor();
  var advsearchPromise = SearchManagement.advancedSearch(currentUser,color,searchTerm);
  advsearchPromise.then(function(result){
    $ionicLoading.hide(); 
    if(result.status==0){
      SearchManagement.setItems(result.data.products); 
      $scope.items = result.data.products; 
    }else{
      AlertingSystem.showAlert("Search Error","Search unsuccessful")
    }
  },function(error){
    $ionicLoading.hide();
    AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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

.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','SearchManagement','UserManagement','WardrobeManagement','$ionicLoading','$ionicPopup','$timeout','$ionicModal', '$ionicSlideBoxDelegate','AlertingSystem',function($scope, $state, $stateParams,SearchManagement,UserManagement,WardrobeManagement,$ionicLoading,$ionicPopup,$timeout,$ionicModal, $ionicSlideBoxDelegate,AlertingSystem) {

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
              UserManagement.getCurrentUser().clothing = currentUser.clothing+1;
            }else{ //Adición de producto sin éxito
              AlertingSystem.showAlert("Adding Error","Clothing adding unsuccessful")
            }
          },function(error){
            $ionicLoading.hide();
            AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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

.controller('OutfitDetailsCtrl', ['$scope','WardrobeManagement','$stateParams','OutfitManagement','$ionicLoading','$ionicPopup','$timeout','UserManagement','AlertingSystem',function($scope,WardrobeManagement,$stateParams,OutfitManagement,$ionicLoading,$ionicPopup,$timeout,UserManagement,AlertingSystem) {
    var item  = WardrobeManagement.getOutfitAtIndex($stateParams.itemId); //Obtención de item específico
    $scope.item = item;
    $scope.item.tags_line = getTags($scope.item.tags)
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

    function getTags(tags){
      var string = "";
      if(tags.length>0){
        string += tags[0].tag
      }
      for(i = 1; i < tags.length;i++){
        string += " "
        string += tags[i].tag
      }
      return string;
    }

    $scope.indexProduct = function(item){ //Obtención de índice de un producto de la vista
     var index = WardrobeManagement.indexOfClothing(item);
     return index;
    }

    $scope.indexOutfit = function(item){ //Obtención de índice de un producto de la vista
     var index = WardrobeManagement.indexOfOutfit(item);
     return index;
    }

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
          AlertingSystem.showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        AlertingSystem.showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }
 }])

.controller('FriendsCtrl', ['$scope','$state','FriendManagement','$ionicLoading','UserManagement','AlertingSystem',function($scope,$state,FriendManagement,$ionicLoading,UserManagement,AlertingSystem) {
  
  function getUsersFriends(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var getPromise = FriendManagement.getFollowingUsers(currentUser); 
    getPromise.then(
      function(result){
        $ionicLoading.hide(); 
        if(result.status==0){
          FriendManagement.setFollowingUsers(result.data);
          $scope.friends = FriendManagement.getFollowing();
        }else{
          AlertingSystem.showAlert("Friendship Error","Couldn't get your followers")
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server -Friendship- Error","Server error, try again later.")
      }); 
  }
   
  getUsersFriends();
  
  $scope.redirectUserSearch = function(){
    $state.go('tab.friends-search');
  }

  $scope.index = function(friend){
    return FriendManagement.getIndexOfFollowing(friend);
  }
}])

.controller('FriendDetailSearchCtrl', ['$scope','FriendManagement','$stateParams','$ionicLoading','UserManagement','$ionicPopup','$timeout','AlertingSystem',function($scope,FriendManagement,$stateParams,$ionicLoading,UserManagement,$ionicPopup,$timeout,AlertingSystem) {
    
    function usericon(friend){ //Estilo en caso de tener la prenda en el guardaropa
       if(friend.is_following==true){
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
        AlertingSystem.showAlert("Profile Error","Profile reading unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
    });

    $scope.follow = function(friend){
      $ionicLoading.show();
      var currentUser = UserManagement.getCurrentUser();
      var followPromise = FriendManagement.followFriend(friend,currentUser);
      followPromise.then(function(result){
        $ionicLoading.hide();
        if(result.status==0){
          friend.is_following = true 
          usericon(friend)
          FriendManagement.addFriend(friend);
          UserManagement.getCurrentUser().following = currentUser.following+1;
        }else{
          AlertingSystem.showAlert("Follow Error","User following unsuccessful")
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('FriendDetailCtrl', ['$scope','FriendManagement','$ionicLoading','UserManagement','$ionicPopup','$timeout','SearchManagement','$stateParams','AlertingSystem',function($scope,FriendManagement,$ionicLoading,UserManagement,$ionicPopup,$timeout,SearchManagement,$stateParams,AlertingSystem) {
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
        AlertingSystem.showAlert("Profile Error","Profile reading unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
    });
}])

.controller('FriendsSearchCtrl', ['$scope','FriendManagement','$ionicLoading','UserManagement','$ionicPopup','$timeout','SearchManagement','$ionicHistory','$state','AlertingSystem',function($scope,FriendManagement,$ionicLoading,UserManagement,$ionicPopup,$timeout,SearchManagement,$ionicHistory,$state,AlertingSystem) {
  
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
        AlertingSystem.showAlert("Search Error","Search unsuccessful")
      }
    },function(error){
      $ionicLoading.hide();
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
    });
  }

  $scope.index = function(friend){
    return FriendManagement.getIndexOfFriend(friend);
  }

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

.controller('WardrobeCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,AlertingSystem){
    
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
        AlertingSystem.showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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
          AlertingSystem.showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('FriendOutfitDetailCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,AlertingSystem){
  
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
      AlertingSystem.showAlert("Outfit Error","Outfit unsuccessful")   
    }
  },function(error){
    $ionicLoading.hide();
    AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")    
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
          AlertingSystem.showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        AlertingSystem.showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }

    $scope.indexOutfit = function(item){ //Obtención de índice de un producto de la vista
      var index = SearchManagement.indexOfOutfit(item);
      return index;
    }
}])

.controller('FriendsOutfitsCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,AlertingSystem){

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
        AlertingSystem.showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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
          AlertingSystem.showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('SearchOutfitsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','$ionicHistory','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,$ionicHistory,AlertingSystem){
  
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
    tag = "#"+ tag;
    var currentUser = UserManagement.getCurrentUser();
    var recommendPromise = OutfitManagement.recommendOutfits(tag,currentUser);
    $ionicLoading.show();
    recommendPromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        $scope.items = result.data
      }else{
        AlertingSystem.showAlert("Recommend Error","Recommend unsuccessful")  
      }
    },function(error){
      $ionicLoading.hide()
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
    })  
  }

  $scope.select = function(){
    $state.go('tab.search-select-clothing')
  }

  $scope.selectedClothing = function(position){
    var array = OutfitManagement.getClothingOfOutfit();
    var item = array[position]
    if(item==null){
      return "http://www.astroscu.unam.mx/cursos/esaobela/Iconos/1305530398_6.png"
    }else{
      return item.image.sizes.Large.url;
    }
  }
  
}])

.controller('SearchSelectClothingCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','$ionicHistory','WardrobeManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,$ionicHistory,WardrobeManagement,AlertingSystem){

   var currentUser = UserManagement.getCurrentUser(); 
    

   function getUsersWardrobeClothing(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var updatePromise = WardrobeManagement.updateWardrobeClothing(currentUser); 
    updatePromise.then(
      function(result){
        $ionicLoading.hide(); 
        if(result.status==0){
          WardrobeManagement.setWardrobeClothing(result.data.wardrobe_products); 
          $scope.products = WardrobeManagement.getWardrobeClothing();      
        }else{
          AlertingSystem.showAlert("Wardrobe Error","Couldn't get your clothing")
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      });
  }

  var clothing = WardrobeManagement.getWardrobeClothing();

  if(clothing.length!=currentUser.clothing){
    getUsersWardrobeClothing();
  }else{
    $scope.products = clothing;
  }

  $scope.select = function(item){
    var index = OutfitManagement.getIndexOfClothing(item);
    if(index==-1){
      var length = OutfitManagement.getClothingLength();
      if(length<3){
        OutfitManagement.addClothingToNewOutfit(item);
        item.style = "selected_style";
      }else{
        AlertingSystem.showAlert("Selection error","Can't select more than 3 products")
      }
    }else{
      OutfitManagement.removeClothingFromNewOutfitAtIndex(index);
      item.style = "";
    }
  }
}])

.controller('SearchOutfitDetailCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicPopup','$timeout','$stateParams','$ionicLoading','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicPopup,$timeout,$stateParams,$ionicLoading,AlertingSystem){
  
  var outfitId = $stateParams.outfitId
  var currentUser = UserManagement.getCurrentUser();    
  var outfitPromise = OutfitManagement.getOutfitById(outfitId,currentUser)

  $ionicLoading.show();
  outfitPromise.then(function(result){
    $ionicLoading.hide();
    if(result.status==0){
      $scope.item = result.data.outfit
      $scope.item.tags_line = getTags($scope.item.tags)
      $scope.products = result.data.outfit_products
      SearchManagement.addOutfit(result.data.outfit)
    }else{
      AlertingSystem.showAlert("Outfit Error","Outfit unsuccessful")   
    }
  },function(error){
    $ionicLoading.hide();
    AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")    
  })

  function getTags(tags){
    var string = "";
    if(tags.length>0){
      string += tags[0].tag
    }
    for(i = 1; i < tags.length;i++){
      string += " "
      string += tags[i].tag
    }
    return string;
  }

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
          AlertingSystem.showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        AlertingSystem.showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }

    $scope.indexOutfit = function(item){ //Obtención de índice de un producto de la vista
      var index = SearchManagement.indexOfOutfit(item);
      return index;
    }
}])

.controller('SearchCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,AlertingSystem){
    
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
        AlertingSystem.showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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
          AlertingSystem.showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('FeedCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','FriendManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,FriendManagement,AlertingSystem){
    
    function processFeedUpdate(){
      var currentUser = UserManagement.getCurrentUser();
      var feedPromise = FriendManagement.getUserFeed(currentUser);
      $ionicLoading.show();
      feedPromise.then(function(result){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        if(result.status==0){
          $scope.news = result.data;
        }else{
          AlertingSystem.showAlert("Feed Error","Feed unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }

    processFeedUpdate();

    $scope.updateFeed = function(){
      processFeedUpdate();
    }

    $scope.loadMoreFeed = function(){

    }
}])

.controller('FeedOutfitCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','FriendManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,FriendManagement,AlertingSystem){

  var outfitId = $stateParams.outfit_id

  getOutfitById(outfitId);
  
  function getOutfitById(id){
    var currentUser = UserManagement.getCurrentUser();    
    var outfitPromise = OutfitManagement.getOutfitById(outfitId,currentUser)
    $ionicLoading.show();
    outfitPromise.then(function(result){
      $ionicLoading.hide();
      if(result.status==0){
        $scope.item = result.data.outfit
        $scope.item.tags_line = getTags($scope.item.tags)
        $scope.products = result.data.outfit_products
      }else{
        AlertingSystem.showAlert("Outfit Error","Outfit unsuccessful")   
      }
    },function(error){
      $ionicLoading.hide();
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")    
    })
  }

  function getTags(tags){
    var string = "";
    if(tags.length>0){
      string += tags[0].tag
    }
    for(i = 1; i < tags.length;i++){
      string += " "
      string += tags[i].tag
    }
    return string;
  }

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
          AlertingSystem.showAlert("Like Error","Outfit like unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        AlertingSystem.showAlert("Fatal Server -Rating- Error","Server error, try again later.")
      })
    }

    $scope.updateOutfitInfo = function(){
      getOutfitById(outfitId);
      $scope.$broadcast('scroll.refreshComplete');
    }
}]) 

.controller('FeedClothingCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','FriendManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,FriendManagement,AlertingSystem){
    
    var item_id  = $stateParams.itemId;
    var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show(); //Mostrar loader
      var productPromise = WardrobeManagement.getProductById(item_id,currentUser);
      productPromise.then(function(result){
        $ionicLoading.hide()
        if(result.status==0){
          $scope.item = result.data
          $scope.images = getImages(result.data);
          $scope.item.colors = getColors(result.data);
          $scope.item.sizes = getSizes(result.data);
          $scope.item.categories = getCategories(result.data);
        }else{
          AlertingSystem.showAlert("Product Error","Product unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })

     function getColors(item){
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

     function getSizes(item){
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

     function getCategories(item){
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
              AlertingSystem.showAlert("Adding Error","Clothing adding unsuccessful")
            }
          },function(error){
            $ionicLoading.hide();
            AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
}])

.controller('FeedOutfitCommentsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','FriendManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,FriendManagement,AlertingSystem){
    
    var outfitId = $stateParams.outfit_id;
    var currentUser = UserManagement.getCurrentUser();
    $ionicLoading.show();
    var commentPromise = OutfitManagement.getOutfitComments(outfitId,currentUser)
    commentPromise.then(function(result){
      $ionicLoading.hide()
      if(result.status==0){
        OutfitManagement.setComments(result.data.outfit_comments);
        $scope.messages = OutfitManagement.getComments()
      }else{
        AlertingSystem.showAlert("Comment Error","Comment unsuccessful")
      }
    },function(error){
      $ionicLoading.hide()
      AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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
          AlertingSystem.showAlert("Comment Error","Comment unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }
}])

.controller('InspirationCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,AlertingSystem){
    
    function processFashionUpdates(){
      var currentUser = UserManagement.getCurrentUser();
      var fashionPromise = SearchManagement.getFashionUpdates(currentUser);
      $ionicLoading.show();
      fashionPromise.then(function(result){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        if(result.status==0){
          $scope.updates = result.data;
        }else{
          AlertingSystem.showAlert("Fashion Error","Fashion unsuccessful")   
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })
    }

    processFashionUpdates();

    $scope.updateFashion = function(){
      processFashionUpdates();
    }    
}])

.controller('SearchClothingSimpleDetailsCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$stateParams','$ionicLoading','$ionicPopup','$timeout', 'WardrobeManagement','FriendManagement','AlertingSystem',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$stateParams,$ionicLoading,$ionicPopup,$timeout,WardrobeManagement,FriendManagement,AlertingSystem){

    var item_id  = $stateParams.itemId;
    var currentUser = UserManagement.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show(); //Mostrar loader
      var productPromise = WardrobeManagement.getProductById(item_id,currentUser);
      productPromise.then(function(result){
        $ionicLoading.hide()
        if(result.status==0){
          $scope.item = result.data
          $scope.images = getImages(result.data);
          $scope.item.colors = getColors(result.data);
          $scope.item.sizes = getSizes(result.data);
          $scope.item.categories = getCategories(result.data);
        }else{
          AlertingSystem.showAlert("Product Error","Product unsuccessful")
        }
      },function(error){
        $ionicLoading.hide()
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      })

     function getColors(item){
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

     function getSizes(item){
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

     function getCategories(item){
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
              AlertingSystem.showAlert("Adding Error","Clothing adding unsuccessful")
            }
          },function(error){
            $ionicLoading.hide();
            AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
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
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
}])


.controller('AccountCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement','$ionicLoading','WardrobeManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement,$ionicLoading,WardrobeManagement){
  
  var currentUser = UserManagement.getCurrentUser();
  $scope.user = currentUser;

  function getUsersWardrobeClothing(){
    $ionicLoading.show(); 
    var currentUser = UserManagement.getCurrentUser(); 
    var updatePromise = WardrobeManagement.updateWardrobeClothing(currentUser); 
    updatePromise.then(
      function(result){
        $ionicLoading.hide(); 
        if(result.status==0){
          WardrobeManagement.setWardrobeClothing(result.data.wardrobe_products);       
        }else{
          AlertingSystem.showAlert("Wardrobe Error","Couldn't get your clothing")
        }
      },function(error){
        $ionicLoading.hide();
        AlertingSystem.showAlert("Fatal Server Error","Server error, try again later.")
      });
  }

  var clothing = WardrobeManagement.getWardrobeClothing();

  if(clothing.length!=currentUser.clothing){
      getUsersWardrobeClothing();
  }

  $scope.logout = function(){
    UserManagement.signout();
    OutfitManagement.setClothing([]);
    WardrobeManagement.setWardrobeClothing([]);
    WardrobeManagement.setWardrobeOutfits([]);
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