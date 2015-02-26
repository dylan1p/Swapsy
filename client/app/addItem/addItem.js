'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addItem', {
        templateUrl: 'app/addItem/addItem.html',
        controller: 'AdditemCtrl',
        authenticate: true
      });
  });
