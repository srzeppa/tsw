/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
// 
//module.exports = mongoose.model('User',{
//    username: String,
//    password: String,
//    email: String,
//    gender: String
//});

 
var UserSchema = new require('mongoose').Schema({
    username: String,
    password: String,
    email: String,
});
 
UserSchema.plugin(require('mongoose-role'), {
  roles: ['referee', 'admin'],
  accessLevels: {
    'public': ['public', 'user', 'admin'],
    'anon': ['public'],
    'referee': ['referee', 'admin'],
    'admin': ['admin'],
  }
});
 
module.exports = mongoose.model('User', UserSchema);