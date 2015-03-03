'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/swap/:swapID', {
        templateUrl: 'app/swap/swap.html',
        controller: 'SwapCtrl'
      });
  });
