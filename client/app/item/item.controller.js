'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,Items,$routeParams) {
    
    var init = function () {
    Items.get({itemId: $routeParams.itemId}).$promise.then(function(data){
                $scope.item = data;
            }, function(err){
            	console.log(err);
        });
	};
       
    init();
  
});
