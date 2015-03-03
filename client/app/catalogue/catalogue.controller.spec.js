'use strict';

describe('Controller: CatalogueCtrl', function () {

  // load the controller's module
  beforeEach(module('swapsyApp'));

  var CatalogueCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CatalogueCtrl = $controller('CatalogueCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
