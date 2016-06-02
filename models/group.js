/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
	referees: [{type: Schema.Types.ObjectId, ref: 'users'}],
	horses:  [{type: Schema.Types.ObjectId, ref: 'horse'}]
});

module.exports = mongoose.model('Group', Group);