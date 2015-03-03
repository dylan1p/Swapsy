'use strict';

angular.module('swapsyApp')
  .factory('Swap',['$resource',
     function($resource) {
            return $resource('/api/Swap/:swapId', {
                swapId: '@_id'
            }, {
                update: {method: 'PUT'},
                query:  {method:'GET', isArray:true},   
                delete: {method:'DELETE'}    
            });
        }
  ]);
 