'use strict';

angular.module('swapsyApp')
  .controller('SwapCtrl', function ($scope,$routeParams,$http,$location,Message,Swap,swapComments,Auth) {
    Swap.get({SwapID: $routeParams.swapID}).$promise.then(function(data){
                $scope.data = data;
                if($scope.getCurrentUser()._id === $scope.data.swapper._id){
                    $scope.status = $scope.data.swapperSent;
                }else{
                    $scope.status = $scope.data.swapySent;
                  }//status of the either party 
            }, function(err){
            	console.log(err);
        });


    $scope.getCurrentUser = Auth.getCurrentUser;
     
    $scope.addComment = function(){
        var comment = {
            _id: $routeParams.swapID,
            user: $scope.getCurrentUser()._id,
            comment: $scope.comment
        }
        var comments = new swapComments(comment);
        comments.$save(function(data) {
                $scope.data.comments.push({
                    user: {_id: $scope.getCurrentUser()._id, name: $scope.getCurrentUser().name},
                    text: data.text
                });
                $scope.comment = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
    }

    

    $scope.myVar = true;
    $scope.swapIt = true;
    $scope.swapped = true;
    
    $scope.showModalRemove = function() {
        $scope.myVar = !$scope.myVar;
    };
    $scope.hideModalRemove = function(){
      $scope.myVar = !$scope.myVar;
    } 
    $scope.showModalAccept = function(){
        $scope.swapIt = !$scope.swapIt;
    }
    $scope.hideModalAccept = function(){
        $scope.swapIt = !$scope.swapIt;
    }
    $scope.sentItem = function(){
        console.log($scope.getCurrentUser()._id);
        $http.put('/api/Swap/sentItem/'+ $scope.data._id,{userID: $scope.getCurrentUser()._id}).success(function(response){
            $scope.data = response;
            $scope.status =true;
        })
    }
    $scope.acceptOffer = function(){
        $scope.swapIt = !$scope.swapIt;
        $scope.swapped = !$scope.swapped;
        $http.put('/api/Swap/acceptOffer/'+ $scope.data._id).success(function(response){
              var message = {
                _id: $scope.data.swapper._id,
                user: $scope.data.swapy._id,
                swap: response._id,
                text: $scope.data.swapy.name + ' has accepted your offer!'
            }
        var mess = new Message(message);
        mess.$send();

        });
        $scope.data = response;
        $scope.$apply();
        $scope.swapIt = !$scope.swapIt;
        
    }
    $scope.cancelSwap = function(){      
        $http.put('/api/Swap/cancel/'+ $scope.data._id).success(function(response){
             $scope.myVar = !$scope.myVar;
             $scope.data = response;
        });
    }
  });

