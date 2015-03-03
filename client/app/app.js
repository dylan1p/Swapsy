'use strict';

angular.module('swapsyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angularFileUpload',
  'ui.sortable'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider.when('/Electronics', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(ItemCat, $rootScope){
                ItemCat.getAll({name:'Electronic'}).$promise.then(function(data){
                    $rootScope.Category = 'Electronics'
                    $rootScope.items = data;
                  }, function(err){
                    console.log(err);
              });
              }
        }
      })
      $routeProvider.when('/Motor', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(ItemCat, $rootScope){
                ItemCat.getAll({name:'Motor'}).$promise.then(function(data){
                    $rootScope.Category = 'Motor'
                    $rootScope.items = data;
                  }, function(err){
                    console.log(err);
              });
              }
        }
      })
      $routeProvider.when('/Clothing', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(ItemCat, $rootScope){
                ItemCat.getAll({name:'Clothing'}).$promise.then(function(data){
                    $rootScope.Category = 'Clothing'
                    $rootScope.items = data;
                  }, function(err){
                    console.log(err);
              });
              }
        }
      })
      $routeProvider.when('/Furniture', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(ItemCat, $rootScope){
                ItemCat.getAll({name:'Furniture'}).$promise.then(function(data){
                    $rootScope.Category = 'Furniture'
                    $rootScope.items = data;
                  }, function(err){
                    console.log(err);
              });
              }
        }
      })
      $routeProvider.when('/Services', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(ItemCat, $rootScope){
                ItemCat.getAll({name:'Service'}).$promise.then(function(data){
                    $rootScope.Category = 'Service'
                    $rootScope.items = data;
                  }, function(err){
                    console.log(err);
              });
              }
        }
      })
      $routeProvider.when('/Jewellery', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(ItemCat, $rootScope){
                ItemCat.getAll({name:'Jewellery'}).$promise.then(function(data){
                    $rootScope.items = data;
                  }, function(err){
                    console.log(err);
              });
              }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, $http) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });