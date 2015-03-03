'use strict';
angular.module('swapsyApp')
  .factory('Catalogue',['$resource',
     function($resource) {
            return $resource('/api/catalogue/:userId', {
                userId: '@_id'
            }, {
                get: {method:'GET' }
            });
        }
  ]);
