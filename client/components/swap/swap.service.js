'use strict';

angular.module('swapsyApp')
  .factory('Swap',['$resource',
     function($resource) {
            return $resource('/api/Swap/:id', {
            }, {
                get: {method:'GET', params:{}, isArray:false},
                update: {method: 'PUT'},
                query:  {method:'GET', isArray:true},   
                delete: {method:'DELETE'}    
            });
        }
  ]);
 