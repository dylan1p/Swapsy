'use strict';

angular.module('swapsyApp')
  .factory('Items',['$resource',
     function($resource) {
            return $resource('/api/items/:itemId', {
                itemId: '@_id'
            }, {
                get:    {method:'GET'},
                save:   {method:'POST'},
                query:  {method:'GET', isArray:true},
                remove: {method:'DELETE'},
                delete: {method:'DELETE'}      
            });
        }
  ]);
