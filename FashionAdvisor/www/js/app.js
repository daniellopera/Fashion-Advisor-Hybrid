angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $stateProvider

  //Estado abstracto Tab
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  //Estado de login
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })

  //Estado de registro
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  //Estado de colección o closet personal
  .state('tab.wardrobe', {
    url: '/wardrobe',
    views: {
      'tab-wardrobe': {
        templateUrl: 'templates/tab-wardrobe.html',
        controller: 'WardrobeCtrl'
      }
    }
  })

  //Estado de colección o closet personal
  .state('tab.wardrobe_products', {
    url: '/wardrobe/outfits',
    views: {
      'tab-wardrobe': {
        templateUrl: 'templates/tab-wardrobe-products.html',
        controller: 'WardrobeProductsCtrl'
      }
    }
  })

  //Estado de detalle de outfit
  .state('tab.wardrobe-outfit-detail', {
    url: '/wardrobe/outfits/:itemId',
    views: {
      'tab-wardrobe': {
        templateUrl: 'templates/tab-wardrobe-outfit-detail.html',
        controller: 'OutfitDetailsCtrl'
      }
    }
  })

  //Estado de detalle de prenda en la colección
  .state('tab.wardrobe-clothing-detail', {
      url: '/wardrobe/clothing/:itemId',
      views: {
        'tab-wardrobe': {
          templateUrl: 'templates/tab-wardrobe-clothing-detail.html',
          controller: 'WardrobeClothingDetailsCtrl'
        }
      }
    })

  //Estado de seleccion de prendas de nuevo atuendo
  .state('tab.wardrobe-select-outfits-clothing', {
      url: '/wardrobe/outfits/selectclothing',
      views: {
        'tab-wardrobe': {
          templateUrl: 'templates/tab-wardrobe-outfit-clothing-selection.html',
          controller: 'OutfitsClothingSelectionCtrl'
        }
      }
    })

  //Estado de creación de atuendo
  .state('tab.wardrobe-create-outfit', {
      url: '/wardrobe/outfits/create',
      cache: false,
      views: {
        'tab-wardrobe': {
          templateUrl: 'templates/tab-wardrobe-outfit-creation.html',
          controller: 'OutfitCreationCtrl'
        }
      }
    })

  //Estado de búsqueda de prendas y outfits
  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })

  //Estado de búsqueda por brand
  .state('tab.advanced-search-brand', {
      url: '/search/advanced/brand',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-advanced-brand.html',
          controller: 'AdvancedSearchBrandCtrl'
        }
      }
    })

  //Estado de detalle de prenda buscada
  .state('tab.search-clothing-detail', {
      url: '/search/clothing/:itemId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-detail-clothing.html',
          controller: 'SearchClothingDetailsCtrl'
        }
      }
    })

  .state('tab.wadrobe-comments', {
      url: '/outfit/comments/:outfitId',
      views: {
        'tab-wardrobe': {
          templateUrl: 'templates/tab-wardrobe-comments.html',
          controller: 'WardrobeCommentsCtrl'
        }
      }
    })

  .state('tab.friends-outfit-comments', {
      url: '/friend/outfit/comments/:outfitId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friend-search-outfit-comments.html',
          controller: 'FriendsOutfitsCommentsCtrl'
        }
      }
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

  .state('tab.friend-detail', {
      url: '/friend/detail/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.friend-outfit-detail', {
      url: '/friend/detail/outfits/:outfitId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friend-outfit-detail.html',
          controller: 'FriendOutfitDetailCtrl'
        }
      }
    })

  .state('tab.friend-search-detail', {
    url: '/friends/search/:friendId',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-search-detail-friend.html',
        controller: 'FriendDetailSearchCtrl'
      }
    }
  })

  .state('tab.friends-search', {
      url: '/friends/search',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends-search.html',
          controller: 'FriendsSearchCtrl'
        }
      }
    })

  //Estado de cuenta de usuario
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  //Estado inicial (por defecto)
  $urlRouterProvider.otherwise('signin');
});
