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
    .populate({path:'swapperItems.owner',select:'name rating'})
    .populate({path:'swapyItems.owner',select:'name rating'})
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
   .populate('swapper','name')
    .populate('swapy','name')
    .populate('comments.user','name')
    .populate({path:'swapperItems.owner',select:'name rating'})
    .populate({path:'swapyItems.owner',select:'name rating'})
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
    console.log(swap);
    return res.json(201, swap);
  });

};
// cancel a swap.
exports.cancel = function(req, res) {
  Swap.findById(req.params.id)
    .populate('swapper','name')
    .populate('swapy','name')
    .populate('comments.user','name')
    .populate({path:'swapperItems.owner',select:'name rating'})
    .populate({path:'swapyItems.owner',select:'name rating'})
    .exec(function (err, swap) {
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
  Swap.findById(req.params.id)
    .populate('swapper','name')
    .populate('swapy','name')
    .populate('comments.user','name')
    .populate({path:'swapperItems.owner',select:'name rating'})
    .populate({path:'swapyItems.owner',select:'name rating'})
    .exec( function (err, swap) {
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
  var photo = req.body.photo;
  Swap.findById(req.params.id)
  .populate('swapper','name')
  .populate('swapy','name')
  .populate('comments.user','name')
  .populate({path:'swapperItems.owner',select:'name rating'})
  .populate({path:'swapyItems.owner',select:'name rating'})
  .exec(function (err, swap) {
    if (err) { return handleError(res, err); }
    if(!swap) { return res.send(404); }
    
    if(userID == swap.swapper)
       swap.swapperSent = photo; // add the photo to whatever users receipt
    else
       swap.swapySent = photo;

    if(swap.swapperSent!=undefined && swap.swapySent!=undefined){ //if both parties have uploaded a receipts (sent items)
      swap.status = 'sent'
      //points awarded to both users
      var swapperTot =0;
      var swapyTot =0;
      var swapperPoints = 100; //points to add to swapper (100 for completing a swap)
      var swapyPoints =100;
      
      swap.swapperItems.forEach(function(i){
        swapperTot+= i.price;
      });
      swap.swapyItems.forEach(function(i){
        swapyTot+= i.price;
      }); // add up each total
      
      if(swapperTot>swapyTot)
        swapperPoints += (swapperTot-swapyTot); //if a party has swapped something of greater value points are added
      else
        swapyPoints += (swapyTot-swapperTot);  

     

      User.findById(swap.swapper, function (err, user) { 
        if (err) { return handleError(res, err); }
          user.points += swapperPoints; 
          user.rating = calcUserRating(user); //converts points to stars
          user.save(function (err,user) {
            if (err) { console.log(err); }
            console.log(user);
          });
      });
      User.findById(swap.swapy, function (err, user) { 
        if (err) { return handleError(res, err); }
          user.points += swapyPoints;
          user.rating = user.calcUserRating(user);
          user.save(function (err,user) {
            if (err) { console.log(err); }
            console.log(user);
          });
      });

    }
       
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
  var millisecondsToAdd= daystoAdd * 24  * 60 * 1000;
  

  date.setTime(date.getTime() + millisecondsToAdd);   

  var j = schedule.scheduleJob(date, function(){ //schedule to sent messages to the user if they have not sent there Item
    Swap.findById(swapID, function (err, swap) { //find the swap again to see if either party has sent items already
      if (err) { return handleError(res, err); }
      var swapperID = swap.swapper;
      var swapyID = swap.swapy;
      
      if(swap.swapperSent === undefined){
        User.findById(swapperID, function (err, user) { 
          if (err) { return handleError(res, err); }
          var message = ({
             user:  swapperID,    
             swap: swap._id,
             text: 'Reminder: Have you completed swap and sent your item?' 
          });
          user.messages.unshift(message);
          var updated = user;
          updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return;
          });
          scheduleReminder(swapID);//schedule reminder for 3 days later again
        });
      }
      if(swap.swapySent === undefined){
        User.findById(swapyID, function (err, user) { 
          if (err) { return handleError(res, err); }
          var message = ({
             user:  swapyID,    
             swap: swap._id,
             text: 'Reminder: Have you completed swap and sent your item?' 
          });
          user.messages.unshift(message);
          var updated = user;
          updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return;
          });
        });
        scheduleReminder(swapID);
      }

    });
  });
}
function handleError(res, err) {
  return res.send(500, err);
}