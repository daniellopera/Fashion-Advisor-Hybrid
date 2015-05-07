//App configuration and routes

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

  //Abstract state
  $stateProvider.state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  //Signin
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })

  //Register
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  //Feed
  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    }
  })  

  //Inspiration
  .state('tab.inspiration', {
    url: '/inspiration',
    views: {
      'tab-inspiration': {
        templateUrl: 'templates/tab-inspiration.html',
        controller: 'InspirationCtrl'
      }
    }
  })

  //Search
  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })

  .state('tab.search-outfits', {
      url: '/search/outfits',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-outfits.html',
          controller: 'SearchOutfitsCtrl'
        }
      }
    })

  .state('tab.search-select-clothing', {
      url: '/search/advanced/select/clothing',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-select-clothing.html',
          controller: 'SearchSelectClothingCtrl'
        }
      }
    })

  .state('tab.search-clothing-detail', {
      url: '/search/clothing/:itemId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-detail-clothing.html',
          controller: 'SearchClothingDetailsCtrl'
        }
      }
    })

  .state('tab.search-outfit-detail', {
      url: '/search/detail/outfits/:outfitId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-outfit-detail.html',
          controller: 'SearchOutfitDetailCtrl'
        }
      }
    })

  .state('tab.search-outfit-comments', {
      url: '/search/outfits/comments/:outfitId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search-outfit-comments.html',
          controller: 'SearchCommentsCtrl'
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

  .state('tab.friend-detail', {
      url: '/friend/detail/:friendId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
  })

  .state('tab.friend-outfit-detail', {
      url: '/search/detail/outfits/:outfitId',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-friend-outfit-detail.html',
          controller: 'FriendOutfitDetailCtrl'
        }
      }
    })

  .state('tab.friend-search-detail', {
    url: '/search/people/:friendId',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search-detail-friend.html',
        controller: 'FriendDetailSearchCtrl'
      }
    }
  })

  .state('tab.friends-search', {
      url: '/search/people',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-friends-search.html',
          controller: 'FriendsSearchCtrl'
        }
      }
    })

  //Personal info (Account)
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.account-wardrobe', {
    url: '/account/wardrobe',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-wardrobe.html',
        controller: 'WardrobeCtrl'
      }
    }
  })

  .state('tab.account-clothing', {
      url: '/account/clothing',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-wardrobe-products.html',
          controller: 'WardrobeProductsCtrl'
        }
      }
  })

  .state('tab.account-wardrobe-clothing-detail', {
      url: '/account/wardrobe/clothing/:itemId',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-wardrobe-clothing-detail.html',
          controller: 'WardrobeClothingDetailsCtrl'
        }
      }
  })

  .state('tab.account-wardrobe-outfit-detail', {
    url: '/account/wardrobe/outfits/:itemId',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-wardrobe-outfit-detail.html',
        controller: 'OutfitDetailsCtrl'
      }
    }
  })

  .state('tab.account-wardrobe-select-outfits-clothing', {
      url: '/account/wardrobe/outfits/selectclothing',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-wardrobe-outfit-clothing-selection.html',
          controller: 'OutfitsClothingSelectionCtrl'
        }
      }
  })

  .state('tab.account-wardrobe-create-outfit', {
      url: '/account/wardrobe/outfits/create',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-wardrobe-outfit-creation.html',
          controller: 'OutfitCreationCtrl'
        }
      }
  })

  .state('tab.account-wadrobe-comments', {
      url: '/account/outfit/comments/:outfitId',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-wardrobe-comments.html',
          controller: 'WardrobeCommentsCtrl'
        }
      }
  })

  .state('tab.account-friends', {
      url: '/account/friends',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
  })

  .state('tab.account-friend-detail', {
      url: '/account/friend/detail/:friendId',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
  })

  .state('tab.account-friend-outfit-detail', {
      url: '/account/detail/outfits/:outfitId',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-friend-outfit-detail.html',
          controller: 'FriendOutfitDetailCtrl'
        }
      }
  })

  .state('tab.account-friends-outfit-comments', {
      url: '/account/friend/outfit/comments/:outfitId',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-friend-search-outfit-comments.html',
          controller: 'FriendsOutfitsCommentsCtrl'
        }
      }
    })
  
  $urlRouterProvider.otherwise('signin');
});
