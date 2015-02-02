'use strict';

angular.module('swapsyApp')
  .factory('Items',['$resource',
     function($resource) {
            return $resource('/api/items/:itemId', {
                itemId: '@_id'
            }, {
                getAll: {method:'GET', isArray:true },
                save:   {method:'POST'},
                query:  {method:'GET', isArray:true},
                remove: {method:'DELETE'},
                update: {method: 'PUT'},
                delete: {method:'DELETE'}      
            });
        }
  ]);
 