'use strict';

angular.module('swapsyApp')
  .controller('CatalogueCtrl', function ($scope, $routeParams, Catalogue) {
    Catalogue.get({id: $routeParams.userId}).$promise.then(function(data){
                $scope.catalogue = data.items;
                $scope.user = data.user;
                $scope.activeAdds = 0;
    			$scope.swappedAdds =0;  
                if (data.items.length != 0){
                	angular.forEach(data.items,function(item){
						if(item.status==='Active')
							$scope.activeAdds++;  
						if(item.staus==='Swapped')
							$scope.swappedAdds ++;            		
                	})
                }
              	

            }, function(err){
            	console.log(err);
        });
  
        
    
  });
