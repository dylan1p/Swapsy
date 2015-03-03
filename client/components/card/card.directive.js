'use strict';

angular.module('swapsyApp')
  .directive('card', function () {
    return {
      templateUrl: 'components/card/card.html',
      scope:{data:'='},      
      restrict: 'E',
      link: function link(scope, el, attr){
      	
      }
    };
  });