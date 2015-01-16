/**
 * Created by Calvin on 13/11/2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema(
    {
        name: String,
        items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
    }
);

module.exports = mongoose.model('Section', SectionSchema);