var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    date: {type: Schema.Types, ref: 'DdMmYyyy'},
    epoc: {type: Number, required: true},
    formatted: {type: String, required: true},
    jsdate: {type: String}
});

// extra validation for a parameter marked as unique:true
// email: {type: String, required: true, unique: true}
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('DateType', schema);