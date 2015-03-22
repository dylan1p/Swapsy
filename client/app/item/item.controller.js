'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,$http,$routeParams,$location,Swap,Items,Message,Comments,Catalogue, Auth) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
    var init = function () {
    Items.get({itemId: $routeParams.itemId}).$promise.then(function(data){
                $scope.item = data;
                if($scope.currentUser){
                     if ($scope.currentUser._id === $scope.item.owner._id )
                       $scope.editable =true;
                    else
                        $http.put('/api/items/view/'+ $routeParams.itemId,{UserID:$scope.getCurrentUser._id}).success(function(){     
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
    $scope.noItems =true;
    $scope.editable=false;
    $scope.getTimes = function(t){
        return new Array(t);
    }
   
    $scope.showModal = function() {
        if($scope.currentUser.name !== undefined){ // if their is someone signed in 
            Catalogue.get({id: $scope.currentUser._id}).$promise.then(function(data){ // get the signed in users catalogue 
                $scope.catalogue = data.items;
                $scope.user = data.user;
                if($scope.catalogue.length === 0){
                    $scope.noItems = !$scope.noItems; //if they have no items set variable to false so it will show error message
                }else{
                    $scope.userItemID = $scope.catalogue[0]._id; //display the first item in their catalogue as preselected
                    $scope.userItem = $scope.catalogue[0];
                    $scope.myVar = !$scope.myVar;
                }                
                }, function(err){
                    console.log(err);
            });  
        }else{
            $scope.notLoggedIn = !$scope.notLoggedIn; //show error message for not logged in
            setTimeout(function() {
                 $scope.notLoggedIn = !$scope.notLoggedIn;
            }, 15);
            
        }
    };
    $scope.changeItem = function(){
        angular.forEach($scope.catalogue, function(item,index){ //change the item which they would like to swap
            if (item._id == $scope.userItemID ) {
                $scope.userItem = item;
            }; 
        }); 
    }
    $scope.hideModal = function(){
        $scope.myVar = !$scope.myVar;
    }
    
    $scope.editItem = function(){
        $location.path('item/edit/' + $scope.item._id);//go to edit item page
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
                }) //updates the items comments on server: PUT
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

        swap.$save(function(response) { //posts a new swap to the server
            var message = {
                _id: $scope.item.owner._id,
                user: $scope.currentUser._id,
                swap: response._id,
                text:'New Swap Offer On ' + $scope.item.name

            }
        var mess = new Message(message);
        mess.$send();

        $location.path('swap/' + response._id);
      }, function(errorResponse) { //if their is an error 
        $scope.error = errorResponse.data.message;
      });
    };

    init();
  
});
