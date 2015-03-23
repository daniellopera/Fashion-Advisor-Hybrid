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
    $state.go('tab.wardrobe-select-outfits-clothing');
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
      $state.go('tab.wardrobe-create-outfit');
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
          WardrobeManagement.addOutfitToWardrobe(name,description,OutfitManagement.getClothingOfOutfit());
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

.controller('SigninCtrl',['$scope','$state','UserManagement','$ionicLoading','$ionicHistory','WardrobeManagement','$ionicPopup','$timeout',function($scope, $state, UserManagement,$ionicLoading,$ionicHistory,WardrobeManagement,$ionicPopup,$timeout) {

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
          $state.go('tab.wardrobe');
        }else{
          showAlert("Wardrobe Error","Couldn't get your outfits")
        }
      },function(error){
        $ionicLoading.hide();
        showAlert("Fatal Server Error","Server error, try again later.")
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

.controller('SearchCtrl', ['$scope','$state','UserManagement','SearchManagement','$ionicLoading','$ionicPopup','$timeout',function($scope, $state, UserManagement, SearchManagement, $ionicLoading,$ionicPopup,$timeout) {

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

 $scope.search = function(searchTerm){ 
  var currentUser = UserManagement.getCurrentUser();
  $ionicLoading.show(); 
  var searchPromise = SearchManagement.searchProducts(currentUser,searchTerm); 
  searchPromise.then(function(result){
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

$scope.advancedSearch = function(){
  SearchManagement.selectBrand({});
  SearchManagement.selectColor({});
  $state.go('tab.advanced-search');
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
}])

.controller('AdvancedSearchCtrl', ['$scope','$state','UserManagement','SearchManagement','$ionicLoading','$ionicPopup','$timeout',function($scope, $state, UserManagement, SearchManagement, $ionicLoading,$ionicPopup,$timeout) {

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

}])

.controller('AdvancedSearchBrandCtrl', ['$scope','$state','UserManagement','SearchManagement','$ionicLoading','$ionicPopup','$timeout',function($scope, $state, UserManagement, SearchManagement, $ionicLoading,$ionicPopup,$timeout) {

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

 $scope.searchBrand = function(searchTerm){
  $ionicLoading.show(); 
  var currentUser = UserManagement.getCurrentUser();
  var searchPromise = SearchManagement.getBrands(currentUser,searchTerm);
  searchPromise.then(function(result){
    $ionicLoading.hide(); 
    if(result.status==0){
      $scope.brands = result.data.brands; 
    }else{
      showAlert("Search Error","Search unsuccessful")
    }
  },function(error){
    $ionicLoading.hide();
    showAlert("Fatal Server Error","Server error, try again later.")
  });
}

$scope.selectBrand = function(brand){
  SearchManagement.selectBrand(brand);
  $state.go('tab.advanced-search');
}

}])

.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','SearchManagement','UserManagement','WardrobeManagement','$ionicLoading','$ionicPopup','$timeout',function($scope, $state, $stateParams,SearchManagement,UserManagement,WardrobeManagement,$ionicLoading,$ionicPopup,$timeout) {

     var item  = SearchManagement.getProductAtIndex($stateParams.itemId); //Obtención de item específico
     $scope.item = item; //Asignación de item a variable en la vista
     $scope.description = "<p>"+item.description+"</p>"; //Parseo de la descripción del item específico

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
            showAlert("Fatal Server Error","Server error, try again later.")
          });
     }

   }])

.controller('WardrobeClothingDetailsCtrl', ['$scope','WardrobeManagement','$stateParams',function($scope,WardrobeManagement,$stateParams) {
    var item  = WardrobeManagement.getClothingAtIndex($stateParams.itemId); //Obtención de item específico
    $scope.item = item;
    $scope.description = "<p>"+item.description+"</p>"; //Parseo de la descripción del item específico
  }])

.controller('OutfitDetailsCtrl', ['$scope','WardrobeManagement','$stateParams',function($scope,WardrobeManagement,$stateParams) {
    var item  = WardrobeManagement.getOutfitAtIndex($stateParams.itemId); //Obtención de item específico
    $scope.item = item;
    $scope.products = item.products;
    $scope.index = function(item){ //Obtención de índice de un producto de la vista
     var index = WardrobeManagement.indexOfClothing(item);
     return index;
   }
 }])

.controller('FriendsCtrl', function($scope) {

})

.controller('FriendDetailCtrl', function($scope) {
})

.controller('AccountCtrl', ['$scope','$state', 'UserManagement','OutfitManagement','SearchManagement',function($scope, $state, UserManagement,OutfitManagement,SearchManagement){
  $scope.logout = function(){
    UserManagement.signout();
    OutfitManagement.setClothing([]);
    SearchManagement.selectBrand({});
    SearchManagement.selectColor({});
    $state.go('signin');
  }
}])
