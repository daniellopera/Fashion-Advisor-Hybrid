angular.module('starter.controllers', [])

/*
WardrobeCtrl (Controlador de guardarropa): Controlador de vista tab-wardrobe.html
-> (Dependencias): $scope, User, Wardrobe, $ionicLoading
*/
.controller('WardrobeCtrl',['$scope','User','Wardrobe','$ionicLoading', function($scope,User,Wardrobe,$ionicLoading) {
    
    var currentUser = User.getCurrentUser(); //Obtención de usuario actual
    $ionicLoading.show({animation: 'fade-in'}); //Mostrar loader
    var collectionPromise = Wardrobe.updateWardrobe(currentUser); //Llamada a servicio de búsqueda de colección
    collectionPromise.then(function(result){
      $ionicLoading.hide(); //Ocultar loader
      if(result.status==0){ 
        //alert("llegó bien la colección")
        $scope.items = result.data.wardrobe_products; //Asignación de resultados a items en vista
      }else{
        //alert("Problema con la colección")
      }
    });

    $scope.updateWardrobe = function(){
      var currentUser = User.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show({animation: 'fade-in'}); //Mostrar loader
      var updatePromise = Wardrobe.updateWardrobe(currentUser); //Llamada a servicio de búsqueda de colección
      updatePromise.then(function(result){
      $ionicLoading.hide(); //Ocultar loader
      if(result.status==0){
        //alert("Llegó bien la colección")
        $scope.$broadcast('scroll.refreshComplete');//Ocultar loader 
        $scope.items = result.data.wardrobe_products; //Asignación de resultados a items en vista
      }else{
        //alert("problema con la colección")
      }
    });
    }
}])

/*
RegisterCtrl (Controlador de registro): Controlador de vista register.html
-> (Dependencias): $scope, $state, User, $ionicLoading, $ionicHistory
*/
.controller('RegisterCtrl', ['$scope','$state','User','$ionicLoading','$ionicHistory',function($scope, $state, User,$ionicLoading,$ionicHistory) {
   
    $scope.register = function(email,password1,password2){ //Gestión de solicitud de registro
      if(password1==password2){
        if(email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){ //Valido email
          $ionicLoading.show({animation: 'fade-in'}); //Mostrar loader
          var registerPromise = User.signup(email,password1); //Llamada a servicio de registro
          registerPromise.then(function(result){
            $ionicLoading.hide(); //Ocultar loader
            if(result.status==0){ //Registro exitoso
              User.setCurrentUser(result.data); //Ingresar
              //alert("registro exitoso")
              $ionicHistory.clearCache(); //Limpiar cache
              $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal 
            }else{ //Registro sin éxito
              alert("Registro sin éxito")
            }
          });
        }else{
          //Email no cumple formato
          alert("Email no cumple formato")
        }
      }else{
        //Contraseñas no coinciden
        alert("Contraseñas no coinciden")
      }
    }

}])

/*
SiginCtrl (Controlador de login o ingreso): Controlador de vista signin.html
-> (Dependencias): $scope, $state, User, $ionicLoading, $ionicHistory
*/
.controller('SigninCtrl', ['$scope','$state','User','$ionicLoading','$ionicHistory',function($scope, $state, User,$ionicLoading,$ionicHistory) {
    
    $scope.login = function(email,password) { //Gestión de solicitud de ingreso
        $ionicLoading.show({animation: 'fade-in'}); //Mostrar loader
        var loginPromise = User.login(email,password); //Llamada a servicio de ingreso
        loginPromise.then(function(result){
             $ionicLoading.hide(); //Ocultar loader
             if(result.status==0){ //Ingreso exitoso
               User.setCurrentUser(result.data); //Ingresar
               $ionicHistory.clearCache(); //Limpiar cache
               //alert("ingreso exitoso")
               $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal 
             }else{ //Ingreso sin éxito
               alert("Ingreso sin éxito")
             }
        });
    };

    $scope.redirectSignup = function(){ //Redirección a estado de registro
      $state.go('register'); //Navegar hacia estado de registro
    }
}])

/*
SearchCtrl (Controlador de búsqueda de prendas y outfits): Controlador de vista tab-search.html
-> (Dependencias): $scope, $state, User, Clothing, $ionicLoading
*/
.controller('SearchCtrl', ['$scope','$state','User','Clothing','$ionicLoading',function($scope, $state, User, Clothing, $ionicLoading) {
   
   $scope.search = function(searchTerm){ //Gestión de solicitud de búsqueda de prendas
      var currentUser = User.getCurrentUser(); //Obtención de usuario actual
      $ionicLoading.show({animation: 'fade-in'}); //Mostrar loader
      var searchPromise = Clothing.searchProducts(currentUser,searchTerm); //Llamada a servicio de búsqueda de prendas
      searchPromise.then(function(result){
          $ionicLoading.hide(); //Ocultar loader
          if(result.status==0){
            //alert("búsqueda exitosa")
            Clothing.setItems(result.data.products); //Guardar resultados
            $scope.items = result.data.products; //Asignación de resultados a productos en vista
          }else{
            alert("Búsqueda sin éxito"); //Búsqueda sin éxito
          }
      });
   }

   $scope.index = function(item){ //Obtención de índice de un producto de la vista
      return Clothing.indexOfProduct(item);
   }

   $scope.searchIcon = function(item){ //Cambio de estilo en caso de tener o no la prenda en el guardaropa
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
-> (Dependencias): $scope, $state, $stateParams, User, Clothing, Wardrobe,$ionicLoading
*/
.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','Clothing','User','Wardrobe','$ionicLoading',function($scope, $state, $stateParams,Clothing,User,Wardrobe,$ionicLoading) {

     var item  = Clothing.getProductAtIndex($stateParams.itemId); //Obtención de item específico
     $scope.item = item; //Asignación de item a variable en la vista
     $scope.description = "<p>"+item.description+"</p>"; //Parseo de la descripción del item específico

     $scope.producticon = function(item){ //Estilo en caso de tener la prenda en el guardaropa
       if(item.in_wardrobe==true){
          $scope.addToWadrobeStyle = {'display':'none'};
          return "heart";
       }else{
          return "bag";
       }
     }
     
     $scope.addToWardrobe = function(item){ //Gestión de solicitud de adición de item (producto) a colección personal (closet)
       var currentUser = User.getCurrentUser(); //Obtención de usuario actual
       $ionicLoading.show({animation: 'fade-in'}); //Mostrar loader
       var addToWardrobePromise = Wardrobe.addToWardrobe(item,currentUser); //Llamada a servicio de adición a guardarropa
       addToWardrobePromise.then(function(result){
            $ionicLoading.hide(); //Ocultar loader
            if(result.status==0){ //Adición exitosa de producto a guardarropa
              //alert("adición exitosa");
              item.in_wardrobe = true;
              $scope.producticon(item); //Setear estilo de prenda en guardaropa
            }else{ //Adición de producto sin éxito
              alert("Adición sin éxito");
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
