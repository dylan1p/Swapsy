'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Item = require('./item.model');

var user;
describe('Item API:', function() {

  var user;
  var item
  // Clear users before testing
  before(function(done) {
    User.remove(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });
      user.save(function(err,data) {
        if (err) return done(err);
        item = {
          name: 'iphone',
          price: 300,
          owner: data._id,
          photos: 'https://swapsy-store.s3.amazonaws.com/s3UploadExample%2F9524%24iPhone5b.jpg',
          description: 'New and comes with box',
          location: 'Navan, Co.Meath',
          condition: 'New',
          category: 'Electronic'
        };
        done();
      });
    });
  });

  // Clear users after testing
  after(function() {
   User.remove().exec(); Item.remove().exec();
  });


  describe('GET /api/items', function() {
      it('should respond with JSON array', function(done) {
        request(app)
          .get('/api/items')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            done();
          });
      });
   }); 

  describe('POST /api/items', function() {
    var token;
    before(function(done) {
    request(app)
      .post('/auth/local')
      .send({
      email: 'test@test.com',
      password: 'password'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        token = res.body.token;
        done();
       });
    });
    it('should respond with JSON object', function(done) {
      request(app)
        .post('/api/items')
        .send(item)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          done();
        });
    });
  });
});

