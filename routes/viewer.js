/* jshint node: true */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('viewer', { title: 'Viewer' });
});

module.exports = router;