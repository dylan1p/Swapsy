'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  
var SwapSchema = new Schema({
	swapper:({type: Schema.Types.ObjectId, ref: 'User'}),
	swapy:({type: Schema.Types.ObjectId, ref: 'User'}),
	swapperItems: [{
	  name: String,
	  price: Number,
	  owner: {type: Schema.Types.ObjectId, ref: 'User'},
	  photos: [String],
	  views: Number,
	  category: String
	}],
	swapyItems: [{
	  name: String,
	  price: Number,
	  owner: {type: Schema.Types.ObjectId, ref: 'User'},
	  photos: [String],
	  views: Number,
	  category: String
	}],
	swapperSent: String,
	swapySent: String,
	date_offered:{type: Date, default: Date.now},
	date_accepted:{type:Date},
	status:{type:String, default: 'requested'} ,
	comments: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},    
    text: String,
    date_placed: {type: Date, default: Date.now}
  }]
});
module.exports = mongoose.model('Swap', SwapSchema);