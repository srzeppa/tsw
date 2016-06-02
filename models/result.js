/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Result = new Schema({
	competition: {type: Schema.Types.ObjectId, ref: 'Competition'},
	horse: {type: Schema.Types.ObjectId, ref: 'horse'},
	overall: Number
});

module.exports = mongoose.model('Result', Result);