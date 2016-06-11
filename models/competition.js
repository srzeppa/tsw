/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Competition = new Schema({
	name: String,
	groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    started: Boolean,
    score: [{type: Schema.Types.ObjectId, ref: 'PartialScore'}]
});

module.exports = mongoose.model('Competition', Competition);
