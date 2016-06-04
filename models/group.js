/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
	referees: [{type: Schema.Types.ObjectId, ref: 'User'}],
	horses:  [{type: Schema.Types.ObjectId, ref: 'Horse'}]
});

module.exports = mongoose.model('Group', Group);