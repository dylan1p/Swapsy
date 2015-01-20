'use strict';

angular.module('swapsyApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth, Items) {
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
    $scope.search = function(){
     Items.getAll({name: $scope.name}).$promise.then(function(data){
                $rootScope.items = data;
            }, function(err){
              console.log(err);
      });
    }
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });