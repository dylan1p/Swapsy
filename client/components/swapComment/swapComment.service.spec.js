'use strict';

describe('Service: swapComment', function () {

  // load the service's module
  beforeEach(module('swapsyApp'));

  // instantiate service
  var swapComment;
  beforeEach(inject(function (_swapComment_) {
    swapComment = _swapComment_;
  }));

  it('should do something', function () {
    expect(!!swapComment).toBe(true);
  });

});
