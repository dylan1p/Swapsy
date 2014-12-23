'use strict';

angular.module('swapsyApp')
  .controller('ItemCtrl', function ($scope,Items,Comments,Auth,$routeParams) {
    
    $scope.getCurrentUser = Auth.getCurrentUser();
    var init = function () {
    Items.get({itemId: $routeParams.itemId}).$promise.then(function(data){
                $scope.item = data;
            }, function(err){
            	console.log(err);
        });
         
	};
   
    $scope.hasItem = function(item){
    	alert('do you have an' + item);
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
                    user: {_id: $scope.getCurrentUser._id, name:$scope.getCurrentUser.name},
                    text: data.text
                })
                $scope.comment = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
    } 

    init();
  
});
