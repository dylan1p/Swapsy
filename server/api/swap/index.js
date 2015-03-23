'use strict';

var express = require('express');
var controller = require('./swap.controller');

var router = express.Router();

router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/cancel/:id', controller.cancel);
router.put('/acceptOffer/:id', controller.acceptOffer);
router.put('/sentItem/:id', controller.sentItem);
router.post('/comment/:id', controller.addComment);

module.exports = router;