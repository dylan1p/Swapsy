'use strict';

angular.module('swapsyApp')
  .controller('AdditemCtrl', function ($scope,$location,$http,$rootScope,$upload,Items,Auth) {

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
    $scope.item.photos = [];
    $scope.currentUser = Auth.getCurrentUser();


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
                console.log($scope.item.photos);
                } else {
                        alert('Upload Failed');
                }
              }, null, function(evt) {
              file.progress =  parseInt(100.0 * evt.loaded / evt.total);
            });
          });
        }(file, i));    
      }
    };    
    
  	$scope.create = function() {
      var item = new Items({
        name: $scope.item.name,
        price: $scope.item.price,
        owner: $scope.currentUser.id,
        photos: $scope.item.photos,
        description: $scope.item.description,
        location: $scope.item.location,
        views: 0,
        category: $scope.item.category,
        statuse:'Active'
      });
      item.$save(function(response) {
        $location.path('item/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
  });

