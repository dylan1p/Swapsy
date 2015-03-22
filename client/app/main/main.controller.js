'use strict';

angular.module('swapsyApp')
  .controller('MainCtrl', function ($scope,$rootScope,$location,Leaderboard) {
	$scope.currentPath = $location.path();
	Leaderboard.getAll(function(leaderboard){
        $scope.leaders = leaderboard;
    });
	$scope.getTimes = function(t){
       return new Array(t);
    } 	
	$scope.getGetOrdinal= function(n) {//adds st nd rd accordingly
	   var s=["th","st","nd","rd"],
	       v=n%100;
	   return n+(s[(v-20)%10]||s[v]||s[0]);
	}//https://ecommerce.shopify.com/c/ecommerce-design/t/ordinal-number-in-javascript-1st-2nd-3rd-4th-29259
  });
