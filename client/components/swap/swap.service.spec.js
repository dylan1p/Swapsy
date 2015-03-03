'use strict';

describe('Service: swap', function () {

  // load the service's module
  beforeEach(module('swapsyApp'));

  // instantiate service
  var swap;
  beforeEach(inject(function (_swap_) {
    swap = _swap_;
  }));

  it('should do something', function () {
    expect(!!swap).toBe(true);
  });

});
