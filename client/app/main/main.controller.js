'use strict';

angular.module('swapsyApp')
  .controller('MainCtrl', function ($scope,$location,Items) {
    	
    	Items.getAll().$promise.then(function(data){
                $scope.items = data;
            }, function(err){
            	console.log(err);
        });
       
  });
