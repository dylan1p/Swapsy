'use strict';

angular.module('swapsyApp')
  .factory('Cat',['$resource',
     function($resource) {
            return $resource('/api/categorys:itemId', {
                itemId: '@_id'
            }, {
                getAll: {method:'GET', isArray:true }
            });
        }
  ]);
