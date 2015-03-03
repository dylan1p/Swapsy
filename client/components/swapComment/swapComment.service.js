'use strict';

angular.module('swapsyApp')
  .factory('swapComments',['$resource',
     function($resource) {
            return $resource('/api/swap/comment/:swapId', {
                swapId: '@_id'
            }, {
                update: {method:'PUT'}
            });
          }
  ]);

