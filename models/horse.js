/* jshint node: true */
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Horse',{
    name: String,
    born: Date,
    owner: String,
    gender: String,
    activate: Boolean,
    group: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
}); 