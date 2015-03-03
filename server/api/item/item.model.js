'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  price: Number,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  photos: [String],
  date_uploaded: { type: Date, default: Date.now },
  description: String,
  location: String,
  condition: String,
  views: {type: Number, default: 0},
  category: String,
  tags:[String],
  status: String,
  comments: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},    
    text: String,
    date_placed: {type: Date, default: Date.now}
  }]
});


module.exports = mongoose.model('Item', ItemSchema);