/*
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Item = require('../api/item/item.model');
var Category = require('../api/category/category.model');
var Swap = require('../api/swap/swap.model');
/*Swap.find({}).remove(function(){});

*/
/*Category.find({}).remove(function() {
  Category.create({
    name: 'Electronics'
  }, {
    name: 'Motor'
  },{
    name: 'Furniture'
  },{
    name: 'Musical Instruments'
  }, {
    name:'Clothing'
  }, function() {
      console.log('finished populating Category');
    }
  );
});*/

/*
Item.find({}).remove(function(){
  console.log('items removed');
});
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});*/