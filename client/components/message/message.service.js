'use strict';

angular.module('swapsyApp')
  .factory('Message',['$resource',
     function($resource) {
            return $resource('/api/users/message/:userID', {
                userId: '@_id'
            }, {
                send: {method:'PUT'}
            });
          }
  ]);