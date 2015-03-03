'use strict';

angular.module('swapsyApp')
  .factory('ItemCat',['$resource',
     function($resource) {
            return $resource('/api/items/cat:itemId', {
                itemId: '@_id'
            }, {
                getAll: {method:'GET', isArray:true }
            });
        }
  ]);
