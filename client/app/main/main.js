'use strict';

angular.module('swapsyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
            items: function(Items,Leaderboard,$rootScope){
                Leaderboard.getAll(function(leaderboard){
                  $rootScope.leaders = leaderboard;
                })
                $rootScope.Category = 'All Categories';
                $rootScope.items =  Items.getAll();
                $rootScope.LeaderBoard = 'Top Swappers';
              }
        }
      
      });
  });