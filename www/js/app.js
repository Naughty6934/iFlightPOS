angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

angular.module('your_app_name', [
    'ionic',
    'popover',
    'your_app_name.common.directives',
    'your_app_name.app.controllers',
    'your_app_name.auth.controllers',
    'your_app_name.app.services',
    'underscore',
    'angularMoment',
    'ngIOS9UIWebViewPatch'
])


// Enable native scrolls for Android platform only,
// as you see, we're disabling jsScrolling to achieve this.
.config(function($ionicConfigProvider) {
    if (ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.navBar.alignTitle("center")

    }
    $ionicConfigProvider.tabs.position('bottom').style('standard');
})

.run(function($ionicPlatform, $rootScope, $ionicHistory, $timeout, $ionicConfig) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    // This fixes transitions for transparent background views
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('auth.welcome') > -1) {
            // set transitions to android to avoid weird visual effect in the walkthrough transitions
            $timeout(function() {
                $ionicConfig.views.transition('android');
                $ionicConfig.views.swipeBackEnabled(false);
                console.log("setting transition to android and disabling swipe back");
            }, 0);
        }
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('app.main.all') > -1) {
            // Restore platform default transition. We are just hardcoding android transitions to auth views.
            $ionicConfig.views.transition('platform');
            // If it's ios, then enable swipe back again
            if (ionic.Platform.isIOS()) {
                $ionicConfig.views.swipeBackEnabled(true);

            }
            console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    //SIDE MENU ROUTES
        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
    })

    .state('app.shop', {
        url: "/shop",
        params: {
            product_by_qty: null,
            isSelected: null,
            products_all: null
        },
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/shop.html",
                controller: 'ShopCtrl'
            }
        }
    })


    .state('app.cart', {
        url: "/cart",
        params:{
            iFlightData : null 
        },
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/cart.html",
                controller: 'ShoppingCartCtrl',
                controller: 'PaymentCtrl'
            }
        }
    })

    .state('app.shipping-address', {
        url: "/shipping-address",
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/shipping-address.html",
                controller: "CheckoutCtrl"
            }
        }
    })

    .state('app.checkout', {
        url: "/checkout",
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/checkout.html",
                controller: "CheckoutCtrl"
            }
        }
    })

    .state('app.product-detail', {
        url: "/product",
        params: {
            data: null,
            orders: null,
            product_data: null,
            isSelected: null
        },
        views: {
            'menuContent': {
                templateUrl: "views/app/shop/product-detail.html",
                controller: 'ProductCtrl'
            }
        }
    })

    .state('app.main', {
        cache: false,
        url: "/main",
        views: {
            'menuContent': {
                templateUrl: "views/app/main.html",
                controller: 'MainCtrl'
            }
        }
    })

    .state('app.main.all', {
        url: "/all",
        views: {
            'main-all': {
                templateUrl: "views/app/main-tabs/main-all.html"
            }
        }
    })

    .state('app.main.keep', {
        url: "/keep",
        views: {
            'main-keep': {
                templateUrl: "views/app/main-tabs/main-keep.html"
            }
        }
    })

    .state('app.main.sold', {
        url: "/sold",
        views: {
            'main-sold': {
                templateUrl: "views/app/main-tabs/main-sold.html"
            }
        }
    })

    .state('app.main.void', {
        url: "/void",
        views: {
            'main-void': {
                templateUrl: "views/app/main-tabs/main-void.html"
            }
        }
    })

    .state('app.pay', {
        url: "/pay",
        views: {
            'menuContent': {
                templateUrl: "views/app/payment/payment.html",
                controller: 'PaymentCtrl'
            }
        }
    })



    ///////////////////////////MasterData//////////////////////////////////////

    .state('app.master', {
        url: "/master",
        views: {
            'menuContent': {
                templateUrl: "views/app/master.html",
                controller: 'MasterCtrl'

            }
        }
    })

    .state('app.promotion', {
        url: "/promotion",
        templateUrl: "views/app/master-data/promotion.html",

    })

    .state('app.exchange', {
        url: "/exchange",
        templateUrl: "views/app/master-data/exchange.html"


    })

    // .state('app.blacklist', {
    //     url: "/blacklist",
    //     templateUrl: "views/app/master-data/blacklist.html"

    // })

    .state('app.data', {
        cache: false,
        url: "/data",
        views: {
            'menuContent': {
                templateUrl: "views/app/master-data/data.html"

            }
        }
    })

    .state('app.data.blacklist', {
        url: "/blacklist",
        views: {
            'data-blacklist': {
                templateUrl: "views/app/master-data/data-blacklist.html"
            }
        }
    })

    .state('app.data.promotion', {
        url: "/promotion",
        views: {
            'data-promotion': {
                templateUrl: "views/app/master-data/data-promotion.html"
            }
        }
    })

    //AUTH ROUTES

    .state('auth', {
        url: "/auth",
        templateUrl: "views/auth/auth.html",
        controller: "AuthCtrl",
        abstract: true
    })

    .state('auth.welcome', {
        url: '/welcome',
        templateUrl: "views/auth/welcome.html",
        controller: 'WelcomeCtrl',
        resolve: {
            show_hidden_actions: function() {
                return false;
            }
        }
    })

    .state('auth.login', {
        url: '/login',
        templateUrl: "views/auth/login.html",
        controller: 'LogInCtrl'
    })

    .state('auth.signup', {
        url: '/signup',
        templateUrl: "views/auth/signup.html",
        controller: 'SignUpCtrl'
    })

    .state('auth.forgot-password', {
        url: '/forgot-password',
        templateUrl: "views/auth/forgot-password.html",
        controller: 'ForgotPasswordCtrl'
    })




    .state('app.orderadjust', {
            url: "/orderadjust",
            views: {
                'menuContent': {
                    templateUrl: "views/app/adjust/orderadjust.html",
                    controller: 'AdjustCtrl'
                }
            }
        })
        .state('app.shopadjust', {
            url: "/shopadjust",
            views: {
                'menuContent': {
                    templateUrl: "views/app/adjust/shopadjust.html",
                    controller: 'ShopCtrl'
                }
            }
        })
        .state('app.adjustdetail', {
            url: "/adjustdetail",
            views: {
                'menuContent': {
                    templateUrl: "views/app/adjust/adjustdetail.html",
                    controller: 'ShopCtrl'
                }
            }
        })






    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/welcome');
    // $urlRouterProvider.otherwise('/app/feed');
})

;
