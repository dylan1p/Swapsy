'use strict';

angular.module('swapsyApp')
  .factory('Comments',['$resource',
     function($resource) {
            return $resource('/api/items/comment/:itemId', {
                itemId: '@_id'
            }, {
                update: {method:'PUT'}
            });
          }
  ]);
