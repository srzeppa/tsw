/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var Group = new Schema({
//	referees: [{type: Schema.Types.ObjectId, ref: 'users'}],
//	horses:  [{type: Schema.Types.ObjectId, ref: 'horse'}]
//});

var Competition = new Schema({
	name: String,
	groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    started: Boolean
});

//var Result = new Schema({
//	competition: {type: Schema.Types.ObjectId, ref: 'Competition'},
//	horse: {type: Schema.Types.ObjectId, ref: 'horse'},
//	overall: Number
//});

module.exports = mongoose.model('Competition', Competition);
//module.exports = mongoose.model('Result', Result);