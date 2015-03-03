'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/item/edit/:itemId', {
        templateUrl: 'app/edit/edit.html',
        controller: 'EditCtrl'
      });
  });
