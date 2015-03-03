'use strict';

var _ = require('lodash');
var Swap = require('./swap.model');
var User = require('../user/user.model');
var schedule = require('node-schedule');
var moment = require('moment');

// Get list of swaps
exports.index = function(req, res) {
  if(req.query){
    Swap.findById(req.query.SwapID)
    .populate('swapper','name')
    .populate('swapy','name')
    .populate('comments.user','name')
    .populate('swapperItems.owner','name')
    .populate('swapyItems.owner','name')
    .exec(function (err, swap) {
      if(err) { return handleError(res, err); }
      if(!swap) { return res.send(404); }
      return res.json(swap);
    });
  }else{
    Swap.find(function (err, swaps) {
      if(err) { return handleError(res, err); }
      return res.json(200, swaps);
    });
  }
};

// Get a single swap
exports.show = function(req, res) {
  Swap.findById(req.params.id)
  .populate('owner','name')
  .exec(function (err, swap) {
    if(err) { return handleError(res, err); }
    if(!swap) { return res.send(404); }
    return res.json(swap);
  });
};

// Creates a new swap in the DB.
exports.create = function(req, res) {
  Swap.create(req.body, function(err, swap) {
    if(err) { return handleError(res, err); }
    return res.json(201, swap);
  });
};
// cancel a swap.
exports.cancel = function(req, res) {
  Swap.findById(req.params.id, function (err, swap) {
    if (err) { return handleError(res, err); }
    if(!swap) { return res.send(404); }
    swap.status = 'cancelled';
    swap.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, swap);
    });
  });
};
// Accept an Offer
exports.acceptOffer = function(req, res) {
  Swap.findById(req.params.id, function (err, swap) {
    if (err) { return handleError(res, err); }
    if(!swap) { return res.send(404); }
    swap.status = 'accepted';
    swap.save(function (err) {
      if (err) { return handleError(res, err); }
      scheduleReminder(swap._id); //schedule to send a reminder to both the parties to send item.
      return res.json(200, swap);
    });
  });
};
// set status to sent
exports.sentItem = function(req, res) {
  var userID = req.body.userID;
  console.log(userID);
  Swap.findById(req.params.id, function (err, swap) {
    if (err) { return handleError(res, err); }
    if(!swap) { return res.send(404); }
    if(userID == swap.swapper){
       swap.swapperSent = true;
    }
    else
       swap.swapySent = true;

    swap.save(function (err) {
      if (err) { return handleError(res, err); }
      scheduleReminder(swap._id); //schedule to send a reminder to both the parties to send item.
      return res.json(200, swap);
    });
  });
};



exports.addComment = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Swap.findById(req.params.id, function (err, swap) {
    if (err) { return handleError(res, err); }
    if(!swap) { return res.send(404); }
    var comment = ({
       user: req.body.user,    
       text: req.body.comment
    });
    swap.comments.push(comment);
    var updated = swap;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, comment);
    });
  });
};
function scheduleReminder(swapID){
  var date = new Date();
  var daystoAdd = 3;
   /* var millisecondsToAdd= daystoAdd * 24 * 60 * 60 * 1000;*/
  var millisecondsToAdd = 5 * 60 * 1000;

  date.setTime(date.getTime() + millisecondsToAdd);   

  var j = schedule.scheduleJob(date, function(){ //schedule to sent messages to the user if they have not sent there Item
    Swap.findById(swapID, function (err, swap) { //find the swap again to see if either party has sent items already
      if (err) { return handleError(res, err); }
      var swapperID = swap.swapper;
      var swapyID = swap.swapy;
      
      if(swap.swapperSent === false){
        User.findById(swapperID, function (err, user) { 
          if (err) { return handleError(res, err); }
          var message = ({
             user:  swapperID,    
             swap: swap._id,
             text: 'Reminder: Have you completed swap and sent your item?' 
          });
          user.messages.push(message);
          var updated = user;
          updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return;
          });
        });
      }
      if(swap.swapySent === false){
        User.findById(swapyID, function (err, user) { 
          if (err) { return handleError(res, err); }
          var message = ({
             user:  swapyID,    
             swap: swap._id,
             text: 'Reminder: Have you completed swap and sent your item?' 
          });
          user.messages.push(message);
          var updated = user;
          updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return;
          });
        });
      }
    });
  });
}
function handleError(res, err) {
  return res.send(500, err);
}