'use strict';

var _ = require('lodash');
var Item = require('./item.model');
var User = require('../user/user.model');

// Get list of items
exports.index = function(req, res) {
  var query = Item.find()
  .populate('owner','name')
  .populate('comments.user','name');
  if(req.query.name){
    query.where({ name: new RegExp('^' + '[' + req.query.name + ']', 'i') });
  }
  query.exec(function (err, items) {
    if(err) { return handleError(res, err); }
    return res.json(200, items);
  });
};
//Get a list of items a user has for swap
exports.catalogue = function(req,res){
  var query = Item.find()
  .populate('owner','name');
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
// Get list of items in category
exports.category = function(req, res) { 
  var query = Item.find()
  .populate('owner','name')
  .populate('comments.user','name');
  if(req.query.name){
    query.where({ category: req.query.name });
  }
  query.exec(function (err, items) {
    if(err) { return handleError(res, err); }
    return res.json(200, items);
  });
};
// Get a single item
exports.show = function(req, res) {
  Item.findById(req.params.id)
  .populate('owner','name')
  .populate('comments.user','name')
  .exec(function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    return res.json(item);
  });
};

// Creates a new item in the DB.
exports.create = function(req, res) {
  Item.create(req.body, function(err, item) {
    if(err) { return handleError(res, err); }
    return res.json(201, item);
  });
};
exports.view = function(req, res) {
  Item.findById(req.params.id, function (err, item) {
    if (err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    item.views ++;
    item.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200);
    });
  });
};

// Updates an existing item in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Item.findById(req.params.id, function (err, item) {
    if (err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    var updated = _.merge(item, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, item);
    });
  });
};
exports.addComment = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Item.findById(req.params.id, function (err, item) {
    if (err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    var comment = ({
       user: req.body.user,    
       text: req.body.comment
    });
    item.comments.push(comment);
    var updated = item;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, comment);
    });
  });
};

// Deletes a item from the DB.
exports.destroy = function(req, res) {
  Item.findById(req.query.id, function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    item.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}