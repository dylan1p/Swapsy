'use strict';

var _ = require('lodash');

var Item = require('../item/item.model');
var User = require('../user/user.model');


//Get a list of items a user has for swap
exports.show = function(req,res){
  var query = Item.find()
  .populate({path:'owner', select:'name points rating'})
  .populate('comments.user','name');
  query.where({owner: req.query.id});
  query.exec(function (err, items) {
    if(err) { return handleError(res, err); }
    var list = {};
    list.items=items;
    var userId = req.query.id;
    User.findById(userId, function (err, user) {
      if (err) return next(err);
      if (!user) return res.send(401);
      list.user = user.profile;
      res.json(200, list);
    });
  
  });
}