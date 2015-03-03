'use strict';

describe('Service: cat', function () {

  // load the service's module
  beforeEach(module('swapsyApp'));

  // instantiate service
  var cat;
  beforeEach(inject(function (_cat_) {
    cat = _cat_;
  }));

  it('should do something', function () {
    expect(!!cat).toBe(true);
  });

});
