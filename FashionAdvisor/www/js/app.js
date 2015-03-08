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

.config(function($stateProvider, $urlRouterProvider) {

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

  //Estado de detalle de búsqueda
  .state('tab.search-clothing-detail', {
      url: '/search/clothing/:itemId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-detail-clothing.html',
          controller: 'SearchClothingDetailsCtrl'
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
    url: '/friend/:friendId',
    views: {
      'tab-friends': {
        templateUrl: 'templates/friend-detail.html',
        controller: 'FriendDetailCtrl'
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
