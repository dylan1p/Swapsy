/*
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Item = require('../api/item/item.model');
var Swap = require('../api/swap/swap.model');


/*User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    address:{
      street: '38 Athlumney Village',
      town: 'Navan',
      county: 'Meath',
      country: 'Ireland'
    },
    points:1000,
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    rating:4,
    points:100,
    address:{
      street: '38 Athlumney Village',
      town: 'Navan',
      county: 'Meath',
      country: 'Ireland'
    },
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});*/
User.find({}).remove(function(){});
Item.find({}).remove(function(){});
Swap.find({}).remove();