'use strict';

angular.module('swapsyApp')
  .controller('EditCtrl', function ($scope,$routeParams,Items,$location,$upload,$http) {
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
  
  var init = function () {
    Items.get({itemId: $routeParams.itemId}).$promise.then(function(data){
                $scope.item = data;
            }, function(err){
            	console.log(err);
        });    
	};
  $scope.sortableOptions = {
    update: function(e, ui) {
      $('#itemImage > img').attr('src', $scope.item.photos[0]);
    }
  };  
	$scope.addTag = function(keyEvent) {
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
                $scope.item.photos.push(parsedData.location);
                 if($scope.item.photos.length<2){
                    $('#itemImage > img').attr('src',$scope.item.photos[0]);
                  }
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
	$scope.update = function(){
    var item = new Items({
        _id: $scope.item._id,
        name: $scope.item.name,
        price: $scope.item.price,
        owner: $scope.item.owner._id,
        photos: $scope.item.photos,
        description: $scope.item.description,
        location: $scope.item.location,
        condition: $scope.item.condition,
        views: $scope.item.views,
        tags: $scope.item.tags,
        category: $scope.item.category,
        statuse:'Active'
      });
		item.owner = $scope.item.owner._id;
		item.$update(function(response){
			$location.path('item/' + response._id);
		});
	}
  $scope.remove = function(){
      Items.remove({id:$scope.item._id}).$promise.then(function(){
                $location.path('/');
            }, function(err){
              console.log(err);
      });    
  }
  init();
	
  });
