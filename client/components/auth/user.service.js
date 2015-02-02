'use strict';

angular.module('swapsyApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      getUser: {
        method:'GET'
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
