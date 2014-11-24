'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  price: Number,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  photos: [String],
  date_uploaded: Date,
  description: String,
  location: {County:String},
  views: Number,
  category: String,
  tags:[String],
  statuse: String
});

module.exports = mongoose.model('Item', ItemSchema);