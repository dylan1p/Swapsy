'use strict';

angular.module('swapsyApp')
  .controller('SwapCtrl', function ($scope,$routeParams,$upload,$http,$location,Message,Swap,swapComments,Auth) {
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


    //user rating 
    $("#userRating").rating({
      starCaptions: {1: "Very Poor", 2: "Poor", 3: "Ok", 4: "Good", 5: "Very Good"},
      starCaptionClasses: {1: "text-danger", 2: "text-warning", 3: "text-info", 4: "text-primary", 5: "text-success"},
    });

    $scope.feedback ='';
    $scope.getCurrentUser = Auth.getCurrentUser;
    
    $scope.submitFeedback = function(){
      var toSendTo; 
      if($scope.getCurrentUser()._id == $scope.data.swapper._id){ //find which user the rating is given too
        toSendTo = $scope.data.swapy._id;
      }
      if($scope.getCurrentUser()._id == $scope.data.swapy._id){ //find which user the rating is given too
        toSendTo = $scope.data.swapper._id;
      }
      var rating = $("#userRating").val();
      $http({
        url:'/api/users/'+ toSendTo + '/feedback',
        method: 'PUT',
        data:{
        'userID':  $scope.getCurrentUser()._id,
        'rating': rating,
        'feedback':$scope.feedback
        }
      }).success(function(){
        $scope.rate = !$scope.rate;
      });


    }

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
    $scope.uploaded = true;
    $scope.sentIt = true;
    $scope.rate = true;
    
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
    $scope.showModalSent = function(){
        $scope.sentIt = !$scope.sentIt;
    }
    $scope.sentItem = function(){
        $scope.data.status ='sent';
        $scope.sentIt = !$scope.sentIt;
        $scope.rate = !$scope.rate;
        $http.put('/api/Swap/sentItem/'+ $scope.data._id,{userID: $scope.getCurrentUser()._id, photo: $scope.uploadedPhoto}).success(function(response){
            $scope.data = response;
            $scope.status =true;
        })
    }

    $scope.onFileSelect = function ($files) {
      $http.get('/aws/config').success(function(config) {
        $scope.config = config;
      });
      $scope.files = $files;
      $scope.upload = [];
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        file.progress = parseInt(0);
        (function (file, i) {
          $http.get('/aws/s3Policy?mimeType='+ file.type).success(function(response) {
          var s3Params = response;
          $scope.upload[i] = $upload.upload({
            url: 'https://' + $scope.config.awsConfig.bucket + '.s3.amazonaws.com/',
            method: 'POST',
            transformRequest: function (data, headersGetter) {
               //Headers change here
                  var headers = headersGetter();
                  delete headers['Authorization'];
                  return data;
            },
            data: {
                    'key' : 's3UploadExample/'+ Math.round(Math.random()*10000) + '$$' + file.name,
                    'acl' : 'public-read',
                    'Content-Type' : file.type,
                    'AWSAccessKeyId': s3Params.AWSAccessKeyId,
                    'success_action_status' : '201',
                    'Policy' : s3Params.s3Policy,
                    'Signature' : s3Params.s3Signature
                  },
                  file: file,
          }).then(function(response) {
          
            file.progress = parseInt(100);
            if (response.status === 201) {
              var data = xml2json.parser(response.data),
                parsedData;
                parsedData = {
                  location: data.postresponse.location,
                  bucket: data.postresponse.bucket,
                  key: data.postresponse.key,
                  etag: data.postresponse.etag
                };
            
                $scope.uploaded = !$scope.uploaded;
                $scope.uploadedPhoto = parsedData.location;
                }else {
                        alert('Upload Failed');
                }
              }, null, function(evt) {
              file.progress =  parseInt(100.0 * evt.loaded / evt.total);
            });
          });
        }(file, i));    
      }
    };
    $scope.acceptOffer = function(){
        $scope.swapIt = !$scope.swapIt;
        $scope.data.status ='accepted';
        $http.put('/api/Swap/acceptOffer/'+ $scope.data._id).success(function(response){
              var message = {
                _id: $scope.data.swapper._id,
                user: $scope.data.swapy._id,
                swap: response._id,
                text: $scope.data.swapy.name + ' has accepted your offer!'
            }
        var mess = new Message(message);
        mess.$send();

        $scope.data = response;
        });

        
    }
    $scope.cancelSwap = function(){      
        $http.put('/api/Swap/cancel/'+ $scope.data._id).success(function(response){
             $scope.myVar = !$scope.myVar;
             $scope.data = response;
        });
    }
  });

