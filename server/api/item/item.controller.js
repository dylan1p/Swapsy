'use strict';

var _ = require('lodash');
var Item = require('./item.model');
var User = require('../user/user.model');
var schedule = require('node-schedule');
var mongoose = require('mongoose');
//var Type = require('type-of-is');
var Q = require('q');
var async = require('async');

var saved = false;
// Get list of items
exports.index = function(req, res) {
  var query = Item.find()
  .populate({path:'owner', select:'name points rating'})
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
  .populate({path:'owner', select:'name points rating'})
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
  .populate({path:'owner', select:'name points rating'})
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
  .populate({path:'owner', select:'name points rating'})
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
    var UserID = req.body.UserID;
    if (err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    item.views ++;
    item.save(function (err) {
      if (err) { return handleError(res, err); }
    });
    if(UserID != undefined){
      User.findById(UserID,function(err,user){ //push item to users viewed items list if they have not already viewed
        if (err) { return handleError(res, err); }
        if(user.views){
          if (user.views.length==0) {// if the user has no views
            user.views.push(item._id);
          }
          if(user.views.indexOf(item._id)==-1){ // if the item is not in the users
            user.views.push(item._id);
          }
          else{
             console.log('viewed before');
          }
        }
       user.save(function (err) {
          if (err) { return handleError(res, err); }
          calculateRecommendations(item,UserID);
          return res.json(200);
        });
     
      });
    }
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

function calculateRecommendations(item, userID){
  var itemID = item._id;
  var likeUsersItems = [];
  var likeItemsPerc = [];
  
  var getLikeUsersViews = function(){
    var deffered = Q.defer();

    User.find({_id: {$ne: userID} ,views: itemID}, function(err,users){ //select users who have also viewed items exlucding current user
    if(err){deffered.reject(err);}
    else{
          users.forEach(function(user){
          user.views.forEach(function(view){//loop trough like users views
            if(!itemID.equals(view)){ //add if not equal to the item viewed
              view=view.toString();
              if(likeUsersItems==null){
                likeUsersItems.push(view); // add all the other items like users have viewed to the list
              }
              if(likeUsersItems.indexOf(view)==-1){
                likeUsersItems.push(view); // add all the other items like users have viewed to the list
              }
            }
          });
        });
        deffered.resolve(likeUsersItems);
      }
    });
    return deffered.promise;
  }
  var calls = [];

  getLikeUsersViews().then(function(likeUsersItems){
    User.findById(userID,function(err,user){ //user to set recommendation list    
      likeUsersItems.forEach(function(ids){
        calls.push(function(callback) {  //find all of the items in like items list
          Item.findById(ids,function(err,sItem){
          if (err)
              return callback(err);
          
          callback(null, sItem);
        });
        });
      });
      async.parallel(calls, function(err, result) {//waits till all the results are found(promise resolved)
            if (err)
                return console.log(err);
          
            result.forEach(function(likeItem){
            var diff= 0;  
            diff += getEditDistance(item.name,likeItem.name);//calaculate the difference between like users items and the item viewed
             
            if((item.price > (likeItem.price+50)) || (item.price < (likeItem.price-50))) //if the items price is not equal to price or 50 euro different
              diff+=5; 
            
            if(item.location != likeItem.location)
              diff+=5;

            if(item.category != likeItem.category)
              diff+=5;          
           
              var index = -1;
              for(var i=0; i<user.recommendations.length; i++){//loop trough to see if item is already in recommendlist so not to add again
                if(user.recommendations[i]._id.equals(likeItem._id))
                  index++;
              }
              if(index ==  -1){//if the user does not already contains this recommendation
                  var itemDiff = {
                  _id: likeItem._id,
                  difference: diff,
                  name: likeItem.name,
                  price: likeItem.price,
                  owner: likeItem.owner,
                  photos: likeItem.photos,
                  condition: likeItem.condition,
                  category: likeItem.category
                }
                likeItemsPerc.push(itemDiff);
              }
            })
          var sortedPerc = _.sortBy(likeItemsPerc, 'difference');//sort based on difference 
          if(sortedPerc.length>=2){
            user.recommendations.unshift(sortedPerc[0],sortedPerc[1]);
          }
          if(sortedPerc.length==1){
            user.recommendations.unshift(sortedPerc[0]);
          }
         
          user.save(function (err,user) {
            if (err) { console.log(err); }
             console.log(user);
          });
          
        });
    });
  });
  //leveinshtein distance algorithm
  function getEditDistance(a, b) {
    if(a.length === 0) return b.length; 
    if(b.length === 0) return a.length; 
   
    var matrix = [];
   
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
   
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
   
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
   
    return matrix[b.length][a.length];
  }//http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance
}

function handleError(res, err) {
  return res.send(500, err);
}