'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,Items,$http) {
    
    

    Items.get({itemId: '53c05e6fbe88e9181674e3e2'}).$promise.then(function(data){
                    $scope.items = data;
                }, function(err){
                        console.log(err);
                });
  
});
