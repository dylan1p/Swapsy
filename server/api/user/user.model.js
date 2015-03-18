'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var Swap = require('../swap/swap.model');
var User = require('./user.model');
var moment = require('moment');

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  address:{
    street: String,
    city: String,
    county: String
  },
  photo:{type: String, default:'https://swapsy-store.s3.amazonaws.com/s3UploadExample%2F780%24user.jpg'},
  role: {
    type: String,
    default: 'user'
  },
  recommendations:[{ 
    name: String,
    price: Number,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    photos: [String],
    category: String
  }],
  views:[{type: Schema.Types.ObjectId, ref: 'Item'}],
  messages:[{
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    swap:{type: Schema.Types.ObjectId, ref: 'Swap'},
    text: String,
    status:{type: String, default: 'UnRead'}
  }],
  feedback:[{
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    rating:Number,
    feedback:String,
    date_placed: {type: Date, default: Date.now}
  }],
  dateJoined: { type: Date, default: Date.now },
  points: {type: Number, default: 0},
  rating: {type:Number, default:0},
  hashedPassword: String,
  provider: String,
  salt: String
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id':this._id,
      'name': this.name,
      'role': this.role,
      'feedback':this.feedback,
      'photo':this.photo,
      'address': this.address,
      'dateJoined':moment(this.dateJoined).format('Do MMMM YYYY'),
      'points':this.points,
      'rating':this.rating
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {

  calcUserRating:function (user){
    var points = user.points;
    var rating = 0;

    if(points==0)
      rating = 0;
    
    if(points>0 && points<500)
      rating = 1;
    
    if(points>=500 && points<1000)
      rating = 2;

    if (points>=1000 && points<1500)
      rating = 3;

    if (points>=1500 && points<2000)
      rating = 4;

    if (points>=2000)
      rating = 5;

    return rating;
  },
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
