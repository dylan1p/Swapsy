'use strict';

describe('Controller: AdditemCtrl', function () {

  // load the controller's module
  beforeEach(module('swapsyApp'));

  var AdditemCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdditemCtrl = $controller('AdditemCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
