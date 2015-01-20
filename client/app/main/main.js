'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(Items, $rootScope){
                $rootScope.items =  Items.getAll();
              }
        }
      
      });
  });