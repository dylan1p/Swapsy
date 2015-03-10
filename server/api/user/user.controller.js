'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');


var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId)
  .populate({path:'recommendations.owner', select:'name points rating'})
  .exec(function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};
exports.message = function(req, res){
  User.findById(req.body._id, function (err, user) {
    
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var message = ({
       user: req.body.user,    
       swap: req.body.swap,
       text: req.body.text
    });
    user.messages.unshift(message);
    var updated = user;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, message);
    });
  });
}


/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.readMessage = function(req,res){
  var query = User.find();
  query.where({'messages._id': req.params.id});
  query.exec(function(err, users){
    var user = users[0];
    for(var i = 0; i< user.messages.length; i++){
       if(user.messages[i]._id == req.params.id){
           user.messages[i].status = 'Read';
       }
     }
     user.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, user.messages);
    });
  });
}
exports.feedback = function(req,res){ //function to add user feedback
  var userId = req.params.id;
  var rating = req.body.rating;
  var rateUser = req.body.userID;
  User.findById(userId, function (err, user) {
    if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      var feedback = ({
         user: rateUser,    
         feedback: req.body.feedback,
         rating: rating
      }); //build feeback object 
      user.feedback.unshift(feedback);
      user.points += rating * 100;
      user.rating = user.calcUserRating(user); 
     var updated = user;
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, user);
      });
    });
}


/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword')// don't ever give out the password or salt
  .populate('messages.user','name')
  .populate({path:'recommendations.owner', select:'name points rating'})
  .exec(function(err, user) { 
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
