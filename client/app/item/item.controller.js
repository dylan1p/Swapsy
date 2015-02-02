'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,Items,Comments,Catalogue, Auth,$routeParams,$location) {
    
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

    init();
  
});
