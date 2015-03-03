'use strict';

describe('Controller: SwapCtrl', function () {

  // load the controller's module
  beforeEach(module('swapsyApp'));

  var SwapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SwapCtrl = $controller('SwapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
