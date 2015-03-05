angular.module('starter.services', [])

//User
.factory('User', ['$http',function($http) {
    var currentUser;
    return {
           login: function(email,password){
              return $http({
                method:"POST",
                url:"http://fashionadvisor.herokuapp.com/users/sign_in",
                data:{"user":{"email":email,"password":password}}}).
                then(function(result){          
                  alert(JSON.stringify(result.data));
                  return result.data;
               });
            },
            signup: function(email,password){
              return $http({
                method:"POST",
                url:"http://fashionadvisor.herokuapp.com/users",
                data:{"user":{"email":email,"password":password}}}).
                then(function(result){
                  alert(JSON.stringify(result.data));
                  return result.data;
               });
            },
            getCurrentUser: function(){
                return currentUser;
            },
            setCurrentUser: function(user){
                currentUser = user;
            }
           };
}])

//Clothing
.factory('Clothing', ['$http',function($http) {
  var items;
    return {
            searchProducts: function(user,searchTerm){
              return $http({
                method:"GET",
                url:"http://fashionadvisor.herokuapp.com/search/"+searchTerm+".json",
                headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}}).
                then(function(result){
                  alert(JSON.stringify(result.data));
                  return result.data;
               });
            },
            getProducts: function(){
                return items;
            },
            getProductAtIndex: function(id){
                return items[id];
            },
            indexOfProduct: function(item){
                return items.indexOf(item);
            },
            setItems: function(products){
                items = products;
            }
           };
}])

//Wardrobe
.factory('Wardrobe', ['$http',function($http) {
  var wardrobe;
    return {
            addToWardrobe: function(item,user){
              return $http({
                method:"POST",
                url:"http://fashionadvisor.herokuapp.com/user/products",
                headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token},
                data:{"product_id":item.id}
                }).
                then(function(result){        
                  alert(JSON.stringify(result.data));
                  return result.data;
               });
            },
            getWardrobe: function (user){
              return $http({
                method:"GET",
                url:"http://fashionadvisor.herokuapp.com/user/products",
                headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}
                }).
                then(function(result){
                  alert(JSON.stringify(result.data));
                  return result.data;
               });
            }
           };
}])

.factory('Friends', function() {
  
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
