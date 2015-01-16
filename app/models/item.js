/**
 * Created by Calvin on 13/11/2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {type: String, default: ''},
    ip: {type: String, default: ''},
    port: {type: String, default: ''},
    url: {type: String, default: ''},
    status: {type: String, default: 'closed'},
    section: {type: Schema.Types.ObjectId, ref: 'Section'}
});

module.exports = mongoose.model('Item', ItemSchema);