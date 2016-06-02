/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
	referees: [{type: Schema.Types.ObjectId, ref: 'Account'}],
	horses:  [{type: Schema.Types.ObjectId, ref: 'Horse'}]
});

var Competition = new Schema({
	name: String,
	groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
});

var Result = new Schema({
	competition: {type: Schema.Types.ObjectId, ref: 'Competition'},
	horse: {type: Schema.Types.ObjectId, ref: 'Horse'},
	overall: Number
});

module.exports = mongoose.model('Group', Group);
module.exports = mongoose.model('Competition', Competition);
module.exports = mongoose.model('Result', Result);