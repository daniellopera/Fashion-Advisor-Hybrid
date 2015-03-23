angular.module('starter.services', [])

.factory('UserManagement', ['$http',function($http) {
  var currentUser;
  return {
   login: function(email,password){
    return $http({
      method:"POST",
      url:"http://fashionadvisor.herokuapp.com/users/sign_in",
      data:{"user":{"email":email,"password":password}}}).
    then(function(result){          
      return result.data;
    });
  },
  signup: function(email,password){
    return $http({
      method:"POST",
      url:"http://fashionadvisor.herokuapp.com/users",
      data:{"user":{"email":email,"password":password}}}).
    then(function(result){
      return result.data;
    });
  },
  getCurrentUser: function(){
    return currentUser;
  },
  setCurrentUser: function(user){
    currentUser = user;
  },
  signout: function(){ 
    currentUser = null;
  }
};
}])

.factory('SearchManagement', ['$http',function($http) {
  var searchedItems;
  var selectedBrand;
  var selectedColor;
  return {
    searchProducts: function(user,searchTerm){
      return $http({
        method:"GET",
        url:"http://fashionadvisor.herokuapp.com/search/?search_text="+searchTerm.replace(/ /g, "_"),
        headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}}).
      then(function(result){
        return result.data;
      });
    },
    getProducts: function(){
      return searchedItems;
    },
    getProductAtIndex: function(id){
      return searchedItems[id];
    },
    indexOfProduct: function(item){
      return searchedItems.indexOf(item);
    },
    setItems: function(products){
      searchedItems = products;
    },
    getBrands: function(user,brand){
     return $http({
      method:"GET",
      url:"http://fashionadvisor.herokuapp.com/brands/search/"+brand.replace(/ /g, "_"),
      headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}}).
     then(function(result){
      return result.data;
    });
   },
   selectBrand: function(brand){
    selectedBrand = brand;
  },
  getBrand: function(){
    return selectedBrand;
  },
  getColors: function(user){
    return $http({
      method:"GET",
      url:"http://fashionadvisor.herokuapp.com/colors",
      headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}}).
    then(function(result){
      return result.data;
    });
  },selectColor: function(color){
    selectedColor = color;
  },getColor: function(){
    return selectedColor;
  },
  advancedSearch : function(user,color,brand,term){
    var str = "?";
    if(term!=undefined){
      str+="search_text="+term;
    }
    if(angular.isString(color)){
      str+="&color_id="+color;
    }
    if(brand.id!=undefined){
      str+="&brand_id="+brand.id;
    }
    return $http({
      method:"GET",
      url:"http://fashionadvisor.herokuapp.com/search/"+str.replace(/ /g, "_"),
      headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}}).
    then(function(result){
      return result.data;
    });
  }
};
}])

.factory('WardrobeManagement', ['$http',function($http) {
  
  var clothing = [];

  var outfits = [];

  return {
    addClothingToWardrobe: function(item,user){
      return $http({
        method:"POST",
        url:"http://fashionadvisor.herokuapp.com/user/products",
        headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token},
        data:{"product_id":item.id}
      }).
      then(function(result){        
        return result.data;
      });
    },
    addOutfitToWardrobe: function(name,description,products){
      var outfit = {};
      outfit.name = name;
      outfit.description = description;
      outfit.products = products;
      outfits.push(outfit);
    },
    updateWardrobeClothing: function (user){
      return $http({
        method:"GET",
        url:"http://fashionadvisor.herokuapp.com/user/products",
        headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}
      }).
      then(function(result){
        return result.data;
      });
    },
    updateWardrobeOutfits: function (user){
      return $http({
        method:"GET",
        url:"http://fashionadvisor.herokuapp.com/user/outfits",
        headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token}
      }).
      then(function(result){
        return result.data;
      });
    },
    getWardrobeClothing: function(){
      return clothing;
    },
    getWardrobeOutfits:function(){
      return outfits;
    },
    setWardrobeClothing:function(wardrobe){
      clothing = wardrobe;
    },
    setWardrobeOutfits:function(wardrobe){
      outfits = wardrobe;
    },
    getClothingAtIndex: function(id){
      return clothing[id];
    },
    getOutfitAtIndex: function(id){
      return outfits[id];
    },
    indexOfClothing: function(item){
      for (i = 0; i < clothing.length; i++) {
        if(item.id == clothing[i].id){
          return i;
        }
      }
    },
    indexOfOutfit: function(item){
      return outfits.indexOf(item);
    },
    addProductToClothing: function(item){
      clothing.push(item);
    },
    unselectAll : function(){
      for (i = 0; i < clothing.length; i++) {
        clothing[i].selected = "";    
      }
    }
  };
}])

.factory('OutfitManagement', ['$http',function($http) {

  var clothing = [];

  function getClothingIDs(){
    var ids = [];
    for (i = 0; i < clothing.length; i++) {
      ids.push(clothing[i].id);
    }
    return ids;
  }

  return {
    addClothingToNewOutfit: function(item){
      clothing.push(item);
    },
    removeClothingFromNewOutfitAtIndex: function(index){
      clothing.splice(index,1);
    },
    getClothingOfOutfit: function(){
      return clothing;
    },
    getIndexOfClothing: function(item){
      return clothing.indexOf(item);
    },
    setClothing: function(products){
      clothing = products;
    },
    getClothingLength: function(){
      return clothing.length;
    }
    ,
    createOutfit: function(user,name,description){
      var outfit = {}
      outfit.fullname = name;
      outfit.about = description;
      outfit.products = getClothingIDs();
      return $http({
        method:"POST",
        url:"http://fashionadvisor.herokuapp.com/user/outfits",
        headers:{"X-User-Email":user.email,"X-User-Token":user.auth_token},
        data:outfit
      }).
      then(function(result){
        return result.data;
      });
    }
  };
}])



