'use strict';

angular.module('swapsyApp')
  .controller('AdditemCtrl', function ($scope,$location,$http,$rootScope,$upload,Items,Auth) {

   $scope.categories = [
      'Electronic',
      'Motor',
      'Furniture',
      'Musical Instrument',
      'Clothing'
    ];
    $scope.condition = [
      'New',
      'Used',
      'Factory Restored',
      'Faulty'
    ];
    $scope.item = {};
    $scope.item.photos = [];
    $scope.item.tags = [];


    
    $scope.getCurrentUser = Auth.getCurrentUser;
    
    $scope.addTag = function(keyEvent) { //when enter is clicked
      if (keyEvent.which === 13){
         $scope.item.tags.push($scope.tag);
         $scope.tag = "";
      }
       
    }
    $scope.removeTag = function(tag){
      $scope.item.tags.splice($scope.item.tags.indexOf(tag),1);
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
            }, //removes authorization header which was being posted by angular
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
                $scope.item.photos.push(parsedData.location);
                 if($scope.item.photos.length<2){
                    $('#itemImage > img').attr('src',$scope.item.photos[0]); //sets the image on the card to be the first image
                  }
                }else {
                        alert('Upload Failed');
                }
              }, null, function(evt) {
              file.progress =  parseInt(100.0 * evt.loaded / evt.total);
            });
          });
        }(file, i));    
      }
    };    //https://github.com/nukulb/s3-angular-file-upload
    
  	$scope.create = function() {
      $scope.currentUser = Auth.getCurrentUser();
      
      var item = new Items({
        name: $scope.item.name,
        price: $scope.item.price,
        owner: $scope.currentUser._id,
        photos: $scope.item.photos,
        description: $scope.item.description,
        location: $scope.item.location,
        condition: $scope.item.condition,
        tags: $scope.item.tags,
        category: $scope.item.category
      }); //creates a new item
      item.$save(function(response) {
        $location.path('item/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
  });

