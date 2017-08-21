var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    name: {type: String, required: true, unique: true},
    type: {type: Number, required: true, unique: true}
});

// extra validation for a parameter marked as unique:true
// email: {type: String, required: true, unique: true}
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('CouponType', schema);