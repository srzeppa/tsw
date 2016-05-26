/* jshint node: true */
 
var mongoose = require('mongoose');

module.exports = mongoose.model('Horse',{
  name: String,
  born: Date,
  owner: String,
  gender: String
}); 