'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/item', {
        templateUrl: 'app/item/item.html',
        controller: 'ItemCtrl'
      });
  });
