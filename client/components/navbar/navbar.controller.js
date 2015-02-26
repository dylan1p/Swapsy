'use strict';

angular.module('swapsyApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, $http,Auth, Items) {
    $scope.menu = [{
      'title': 'Electronics',
      'link': '/Electronics'
    },
    {
      'title': 'Motor',
      'link': '/Motor'
    },
    {
      'title': 'Clothing',
      'link': '/Clothing'
    },
    {
      'title': 'Furniture',
      'link': '/Furniture'
    },
    {
      'title': 'Services',
      'link': '/Services'
    },
    {
      'title': 'Jewellery',
      'link': '/Jewellery'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.numberOfMessages = 0;
    angular.forEach(Auth.getCurrentUser().messages, function(message, key){
      if (message.status != 'Read') {
        $scope.numberOfMessages++;
      };
    }) 

   $scope.read= function(index){
    $http.put('api/users/readMessage/'+index,{}).success(function(){
    });
   }
    

    $scope.searchK = function(keyEvent){
      if (keyEvent.which === 13){
       Items.getAll({name: $scope.name}).$promise.then(function(data){
                  $rootScope.items = data;
              }, function(err){
                console.log(err);
        });
       $location.path('/');
      }
    }
    $scope.search = function(){
     Items.getAll({name: $scope.name}).$promise.then(function(data){
                $rootScope.items = data;
            }, function(err){
              console.log(err);
      });
     $location.path('/');
    }
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });