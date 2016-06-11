/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartialScore = new Schema({
        legs: Number,
        head: Number,
        movement: Number,
        body: Number,
        neck: Number,
        referee: { type: Schema.Types.ObjectId, ref: 'User' },
        horse: { type: Schema.Types.ObjectId, ref: 'Horse' }
    });

module.exports = mongoose.model('PartialScore', PartialScore);
