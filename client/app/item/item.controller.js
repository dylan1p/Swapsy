'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,$routeParams,$location,Swap,Items,Comments,Catalogue, Auth) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
    var init = function () {
    Items.get({itemId: $routeParams.itemId}).$promise.then(function(data){
                $scope.item = data;
            }, function(err){
            	console.log(err);
        });
        
	};
    $scope.currentUser = Auth.getCurrentUser()
    $scope.myVar = true;
   
    $scope.showModal = function() {
        if($scope.getCurrentUser){
            Catalogue.get({id: $scope.currentUser._id}).$promise.then(function(data){
               
                $scope.catalogue = data.items;
                $scope.user = data.user;
                $scope.userItemID = $scope.catalogue[0]._id;
                $scope.userItem = $scope.catalogue[0];
                 
                }, function(err){
                    console.log(err);
            });  
        }
       
        $scope.myVar = !$scope.myVar;
    };
    $scope.changeItem = function(){
        angular.forEach($scope.catalogue, function(item,index){
            if (item._id == $scope.userItemID ) {
                $scope.userItem = item;
            };
        }); 
    }
    $scope.hideModal = function(){
        $scope.myVar = !$scope.myVar;
    }
    
    $scope.editItem = function(){
        $location.path('item/edit/' + $scope.item._id);
    }
    $scope.addComment = function(){
        var comment = {
            _id: $routeParams.itemId,
            user: $scope.getCurrentUser._id,
            comment: $scope.comment
        }
        var comments = new Comments(comment);

        comments.$update(function(data) {
                $scope.item.comments.push({
                    user: {_id: $scope.getCurrentUser._id, name: $scope.getCurrentUser.name},
                    text: data.text
                })
                $scope.comment = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
    } 
    $scope.swapItem = function(){
        var swap = new Swap({
            Swapper: $scope.currentUser._id,
            Swapy: $scope.item.owner._id,
            SwapperItems:[{ 
                name: $scope.userItem.name,
                price: $scope.userItem.price,
                owner: $scope.currentUser._id,
                photos: $scope.userItem.photos,
                condition: $scope.userItem.condition,
                views: $scope.userItem.views,
                category: $scope.userItem.category
            }],
            SwapyItems:[{ 
                name: $scope.item.name,
                price: $scope.item.price,
                owner: $scope.item.owner._id,
                photos: $scope.item.photos,
                condition: $scope.item.condition,
                views: $scope.item.views,
                category: $scope.item.category
            }]
        });
        swap.$save(function(response) {
        $location.path('swap/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    init();
  
});
