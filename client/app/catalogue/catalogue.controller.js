'use strict';

angular.module('swapsyApp')
  .controller('CatalogueCtrl', function ($scope, $routeParams, Catalogue) {
    Catalogue.get({id: $routeParams.userId}).$promise.then(function(data){
                $scope.catalogue = data.items;
                $scope.user = data.user;
                
            }, function(err){
            	console.log(err);
        });
  
        
    
  });
