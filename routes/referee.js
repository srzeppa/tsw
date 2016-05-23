/* jshint node: true */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('referee', { title: 'Referee' });
});

module.exports = router;