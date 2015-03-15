'use strict';

angular.module('swapsyApp')
  .factory('Leaderboard',['$resource',
     function($resource) {
            return $resource('/api/users/leaderboard:Id', {
                Id: '@_id'
            }, {
                getAll: {method:'GET', isArray:true }
            });
        }
  ]);