'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,$http,$routeParams,$location,Swap,Items,Message,Comments,Catalogue, Auth) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
    var init = function () {
    Items.get({itemId: $routeParams.itemId}).$promise.then(function(data){
                $scope.item = data;
                if($scope.currentUser){
                     if ($scope.currentUser._id === $scope.item.owner._id )
                       return;
                    else
                        $http.put('/api/items/view/'+ $routeParams.itemId,{UserID:$scope.getCurrentUser._id}).success(function(){
                            console.log('view');
                        });
                }
                     //If not the owner log view
            }, function(err){
            	console.log(err);
        });
	};
    $scope.currentUser = Auth.getCurrentUser();
    $scope.myVar = true;
    $scope.notLoggedIn = true;
   
    $scope.showModal = function() {
        if($scope.currentUser.name !== undefined){
            Catalogue.get({id: $scope.currentUser._id}).$promise.then(function(data){
                $scope.catalogue = data.items;
                $scope.user = data.user;
                $scope.userItemID = $scope.catalogue[0]._id;
                $scope.userItem = $scope.catalogue[0];
                $scope.myVar = !$scope.myVar;
                }, function(err){
                    console.log(err);
            });  
        }else{
            $scope.notLoggedIn = !$scope.notLoggedIn;
            setTimeout(function() {
                 $scope.notLoggedIn = !$scope.notLoggedIn;
            }, 15);
            
        }
       
        
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
            swapper: $scope.currentUser._id,
            swapy: $scope.item.owner._id,
            swapperItems:[{ 
                _id: $scope.userItem._id,
                name: $scope.userItem.name,
                price: $scope.userItem.price,
                owner: $scope.currentUser._id,
                photos: $scope.userItem.photos,
                condition: $scope.userItem.condition,
                category: $scope.userItem.category
            }],
            swapyItems:[{ 
                _id: $scope.item._id,
                name: $scope.item.name,
                price: $scope.item.price,
                owner: $scope.item.owner._id,
                photos: $scope.item.photos,
                condition: $scope.item.condition,
                category: $scope.item.category
            }]
        });

        swap.$save(function(response) {
            var message = {
                _id: $scope.item.owner._id,
                user: $scope.currentUser._id,
                swap: response._id,
                text:'New Swap Offer On ' + $scope.item.name

            }
        var mess = new Message(message);
        mess.$send();

        $location.path('swap/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    init();
  
});
