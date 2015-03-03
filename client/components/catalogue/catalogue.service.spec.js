'use strict';

describe('Service: catalogue', function () {

  // load the service's module
  beforeEach(module('swapsyApp'));

  // instantiate service
  var catalogue;
  beforeEach(inject(function (_catalogue_) {
    catalogue = _catalogue_;
  }));

  it('should do something', function () {
    expect(!!catalogue).toBe(true);
  });

});
