/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Competition = new Schema({
	name: String,
	groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    started: Boolean,
    score : [{
        scoreType: {
            type: String,
            validate: {
                validator: function (v) {
                    return /type|neck|body|legs|movement/.test(v);
                },
                message: '{VALUE} is not a valid role. Must be either user, admin, refree or breeder.'
            }
        },
        value: Number,
        referee: { type: Schema.Types.ObjectId, ref: 'User' }
    }]
});

module.exports = mongoose.model('Competition', Competition);
