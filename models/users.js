/* jshint node: true */
'use strict';

var mongoose = require('mongoose');

var UserSchema = new require('mongoose').Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    activate: Boolean
});
 
UserSchema.plugin(require('mongoose-role'), {
  roles: ['referee', 'admin'],
  accessLevels: {
    'public': ['public', 'referee', 'admin'],
    'anon': ['public', 'admin', 'referee'],
    'referee': ['referee', 'admin'],
    'admin': ['admin']
  }
});
 
module.exports = mongoose.model('User', UserSchema);