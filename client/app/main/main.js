'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(Items, $rootScope){
                $rootScope.Category = 'All Categories'
                $rootScope.items =  Items.getAll();
              }
        }
      
      });
  });