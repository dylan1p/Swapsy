'use strict';

describe('Service: item', function () {

  // load the service's module
  beforeEach(module('swapsyApp'));

  // instantiate service
  var item;
  beforeEach(inject(function (_item_) {
    item = _item_;
  }));

  it('should do something', function () {
    expect(!!item).toBe(true);
  });

});
