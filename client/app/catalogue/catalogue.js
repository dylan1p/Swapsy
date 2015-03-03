'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/catalogue/:userId', {
        templateUrl: 'app/catalogue/catalogue.html',
        controller: 'CatalogueCtrl'
      });
  });
