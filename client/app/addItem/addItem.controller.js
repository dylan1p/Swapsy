'use strict';

angular.module('swapsyApp')
  .controller('AdditemCtrl', function ($scope,Items,Auth,$location) {

     $scope.categories = [
      {name:'Electronics'},
      {name:'Motors'},
      {name:'Furniture'},
      {name:'Musical Instruments'},
      {name:'Clothing'}
    ];
    $scope.condition = [
      {name:'New'},
      {name:'Used'},
      {name:'Factory Restored'},
      {name:'Faulty'}
    ];

    $scope.item = {};
    $scope.currentUser = Auth.getCurrentUser();
    console.log($scope.currentUser);

  	  $scope.create = function() {
           			var item = new Items({
           				name: $scope.item.name,
                  price: $scope.item.price,
                  owner: $scope.currentUser.id,
                  photos: null,
                  description: $scope.item.description,
                  location: $scope.item.location,
                  views: 0,
                  category: $scope.item.category,
                  statuse:'Active'
           			});
           			item.$save(function(response) {
           				console.log(response);
           				$location.path('item/' + response._id);
           			}, function(errorResponse) {
           				$scope.error = errorResponse.data.message;
           			});
           };
    
  });
