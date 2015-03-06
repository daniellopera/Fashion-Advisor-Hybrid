angular.module('starter.controllers', [])

/*
WardrobeCtrl (Controlador de guardarropa): Controlador de vista tab-wardrobe.html
-> (Dependencias): $scope, User, Wardrobe,
*/
.controller('WardrobeCtrl',['$scope','User','Wardrobe','$ionicLoading', function($scope,User,Wardrobe,$ionicLoading) {
    var currentUser = User.getCurrentUser(); //Obtención de usuario actual
    $ionicLoading.show({animation: 'fade-in'});
    var collectionPromise = Wardrobe.updateWardrobe(currentUser); //Llamada a servicio de búsqueda de colección
    collectionPromise.then(function(result){
      if(result.status==0){
        $ionicLoading.hide();
        //alert("llegó bien la colección")
        $scope.items = result.data.wardrobe_products; //Asignación de resultados a items en vista
      }else{
        //alert("problema con la colección")
      }
    });
    $scope.updateWardrobe = function(){
      var currentUser = User.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show({animation: 'fade-in'});
      var updatePromise = Wardrobe.updateWardrobe(currentUser);
      updatePromise.then(function(result){
      $ionicLoading.hide();
      if(result.status==0){
        //alert("llegó bien la colección")
        $scope.$broadcast('scroll.refreshComplete');
        $scope.items = result.data.wardrobe_products; //Asignación de resultados a items en vista
      }else{
        //alert("problema con la colección")
      }
    });
    }
}])

/*
RegisterCtrl (Controlador de registro): Controlador de vista register.html
-> (Dependencias): $scope, $state, User
*/
.controller('RegisterCtrl', ['$scope','$state','User','$ionicLoading',function($scope, $state, User,$ionicLoading) {
   
    $scope.register = function(email,password1,password2){ //Gestión de solicitud de registro
      if(password1==password2){
        if(email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
          $ionicLoading.show({animation: 'fade-in'});
          var registerPromise = User.signup(email,password1); //Llamada a servicio de registro
          registerPromise.then(function(result){
            $ionicLoading.hide();
            if(result.status==0){ //Registro exitoso
              User.setCurrentUser(result.data);
              //alert("registro exitoso")
              $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal 
            }else{ //Registro sin éxito
              //alert("registro sin exito")
            }
          });
        }else{
          //Email no cumple formato
          alert("email no cumple formato")
        }
      }else{
        //Contraseñas no coinciden
        alert("contraseñas no coinciden")
      }
    }

}])

/*
SiginCtrl (Controlador de login o ingreso): Controlador de vista signin.html
-> (Dependencias): $scope, $state, User
*/
.controller('SigninCtrl', ['$scope','$state','User','$ionicLoading',function($scope, $state, User,$ionicLoading) {
    
    $scope.login = function(email,password) { //Gestión de solicitud de ingreso
        $ionicLoading.show({animation: 'fade-in'});
        var loginPromise = User.login(email,password); //Llamada a servicio de ingreso
        loginPromise.then(function(result){
             $ionicLoading.hide();
             if(result.status==0){ //Ingreso exitoso
               User.setCurrentUser(result.data)
               //alert("ingreso exitoso")
               $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal 
             }else{ //Ingreso sin éxito
               //alert("ingreso sin exito")
             }
        });
    };

    $scope.redirectSignup = function(){ //Redirección a estado de registro
      $state.go('register'); //Navegar hacia estado de registro
    }
}])

/*
SearchCtrl (Controlador de búsqueda de prendas y outfits): Controlador de vista tab-search.html
-> (Dependencias): $scope, $state, User, Clothing
*/
.controller('SearchCtrl', ['$scope','$state','User','Clothing','$ionicLoading',function($scope, $state, User, Clothing, $ionicLoading) {
   
   $scope.search = function(searchTerm){ //Gestión de solicitud de búsqueda de prendas
      var currentUser = User.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show({animation: 'fade-in'});
      var searchPromise = Clothing.searchProducts(currentUser,searchTerm); //Llamada a servicio de búsqueda de prendas
      searchPromise.then(function(result){
          $ionicLoading.hide();
          if(result.status==0){
            //alert("búsqueda exitosa")
            Clothing.setItems(result.data.products);
            $scope.items = result.data.products; //Asignación de resultados a productos en vista
          }else{
            //alert("búsqueda sin exito")
          }
      });
   }

   $scope.index = function(item){ //Obtención de índice de un producto de la vista
      return Clothing.indexOfProduct(item);
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

/*
SearchClothingDetailsCtrl (Controlador de detalle de prendas y outfits buscados): Controlador de vista tab-search-detail-clothing.html
-> (Dependencias): $scope, $state, $stateParams, User, Clothing, Wardrobe
*/
.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','Clothing','User','Wardrobe','$ionicLoading',function($scope, $state, $stateParams,Clothing,User,Wardrobe,$ionicLoading) {

     var item  = Clothing.getProductAtIndex($stateParams.itemId); //Obtención de item específico
     $scope.item = item; //Asignación de item a variable en la vista
     $scope.description = "<p>"+item.description+"</p>"; //Parseo de la descripción del item específico

     $scope.producticon = function(item){
       if(item.in_wardrobe==true){
          $scope.addToWadrobeStyle = {'display':'none'};
          return "heart";
       }else{
          return "bag";
       }
     }
     
     $scope.addToWardrobe = function(item){ //Gestión de solicitud de adición de item (producto) a colección personal (closet)
       var currentUser = User.getCurrentUser(); //Obtención de usuario actual
       $ionicLoading.show({animation: 'fade-in'});
       var addToWardrobePromise = Wardrobe.addToWardrobe(item,currentUser); //Llamada a servicio de adición a guardarropa
       addToWardrobePromise.then(function(result){
            $ionicLoading.hide();
            if(result.status==0){ //Adición exitosa de producto a guardarropa
              //alert("adición exitosa");
              item.in_wardrobe = true;
              $scope.producticon(item);
              $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal
            }else{ //Adición de producto sin éxito
              //alert("adición sin éxito");
            }
       });
     }

}])

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', ['$scope','$state', 'User',function($scope, $state, User){
  $scope.logout = function(){
    User.signout();
    $state.go('signin');
  }
}])
