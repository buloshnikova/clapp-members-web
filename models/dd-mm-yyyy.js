var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    day: {type: Number},
    month: {type: Number},
    year: {type: Number}
});

// extra validation for a parameter marked as unique:true
// email: {type: String, required: true, unique: true}
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('DdMmYyyy', schema);