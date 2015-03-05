angular.module('starter.controllers', [])

/*
WardrobeCtrl (Controlador de guardarropa): Controlador de vista tab-wardrobe.html
-> (Dependencias): $scope
*/
.controller('WardrobeCtrl',['$scope','LoginService','WardrobeService', function($scope,LoginService,WardrobeService) {
  var currentUser = LoginService.getCurrentUser(); //Obtención de usuario actual
  var collectionPromise = WardrobeService.getWardrobe(currentUser); //Llamada a servicio de búsqueda de colección
  collectionPromise.then(function(result){
      $scope.items = result.wardrobe_products; //Asignación de resultados a items en vista
  });
}])

/*
RegisterCtrl (Controlador de registro): Controlador de vista register.html
-> (Dependencias): $scope, $state, RegisterService, LoginService 
*/
.controller('RegisterCtrl', ['$scope','$state','RegisterService','LoginService',function($scope, $state, RegisterService, LoginService) {
   
    $scope.register = function(email,password1,password2){ //Gestión de solicitud de registro
      if(password1==password2){
        var registerPromise = RegisterService.signup(email,password1,password2); //Llamada a servicio de registro
        registerPromise.then(function(result){
          if(result.auth_token!=null){ //Registro exitoso
            LoginService.setCurrentUser(result); //Ingreso automático
            $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal
          }else{ //Registro sin éxito
            
          }
        });
      }
    }

}])

/*
SiginCtrl (Controlador de login o ingreso): Controlador de vista signin.html
-> (Dependencias): $scope, $state, LoginService
*/
.controller('SigninCtrl', ['$scope','$state','LoginService',function($scope, $state, LoginService) {
    
    $scope.login = function(email,password) { //Gestión de solicitud de ingreso
        var loginPromise = LoginService.login(email,password); //Llamada a servicio de ingreso
        loginPromise.then(function(result){
            /*
                  var status = result.status
                  if(status==0){ //Operación exitosa
                      currentUser = result.data.user;
                      $state.go('tab.dash')
                  }else if(status==1){
                      mostrar error
                  }else{
                      mostrar error
                  }
            */
             if(result.auth_token!=null){ //Ingreso exitoso
                $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal
             }else{ //Ingreso sin éxito
                
             }
        });
    };

    $scope.redirectSignup = function(){ //Redirección a estado de registro
      $state.go('register'); //Navegar hacia estado de registro
    }
}])

/*
SearchCtrl (Controlador de búsqueda de prendas y outfits): Controlador de vista tab-search.html
-> (Dependencias): $scope, $state, LoginService, SearchService
*/
.controller('SearchCtrl', ['$scope','$state','LoginService','SearchService',function($scope, $state, LoginService, SearchService) {
   
   $scope.search = function(searchTerm){ //Gestión de solicitud de búsqueda de prendas
      var currentUser = LoginService.getCurrentUser(); //Obtención de usuario actual
      var searchPromise = SearchService.search(currentUser,searchTerm); //Llamada a servicio de búsqueda
      searchPromise.then(function(result){
          $scope.items = result; //Asignación de resultados a items en vista
      });
   }

   $scope.index = function(item){ //Obtención de índice de un item de la vista
      return SearchService.indexOfItem(item);
   }

}])

/*
SearchClothingDetailsCtrl (Controlador de detalle de prendas y outfits buscados): Controlador de vista tab-search-detail-clothing.html
-> (Dependencias): $scope, $state, $stateParams, LoginService, SearchService, WardrobeService
*/
.controller('SearchClothingDetailsCtrl', ['$scope','$state','$stateParams','SearchService','LoginService','WardrobeService',function($scope, $state, $stateParams,SearchService, LoginService, WardrobeService) {

     var item  = SearchService.getItem($stateParams.itemId); //Obtención de item específico
     $scope.item = item; //Asignación de item a variable en la vista
     $scope.description = "<p>"+item.description+"</p>"; //Parseo de la descripción del item específico

     $scope.addToWardrobe = function(item){ //Gestión de solicitud de adición de item (producto) a colección personal (closet)
       var currentUser = LoginService.getCurrentUser(); //Obtención de usuario actual
       var addToWardrobePromise = WardrobeService.addToWardrobe(item,currentUser); //Llamada a servicio de adición a guardarropa
       addToWardrobePromise.then(function(result){
            if(result.product!=null){ //Adición exitosa de producto a guardarropa
              $state.go('tab.wardrobe'); //Navegar hacia estado de colección personal
            }else{ //Adición de producto sin éxito

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

.controller('AccountCtrl', ['$scope','$state','LoginService',function($scope, $state, LoginService){

}])
