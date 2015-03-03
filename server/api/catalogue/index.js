'use strict';

var express = require('express');
var controller = require('./catalogue.controller');

var router = express.Router();

router.get('/', controller.show);

module.exports = router;