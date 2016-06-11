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
        referee: { type: Schema.Types.ObjectId, ref: 'User' }
    });

module.exports = mongoose.model('PartialScore', PartialScore);




//        value: Number,
//        scoreType: {
//            type: String,
//            validate: {
//                validator: function (v) {
//                    return /type|neck|body|legs|movement/.test(v);
//                },
//                message: '{VALUE} is not a valid role. Must be either user, admin, refree or breeder.'
//            }
//        },