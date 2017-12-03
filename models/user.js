var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    account_type: {type: String},
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    locations: [{type: Schema.Types.ObjectId, ref: 'Location'}],
    coupons: [{type: Schema.Types.ObjectId, ref: 'Coupon'}]
});

// extra validation for a parameter marked as unique:true
// email: {type: String, required: true, unique: true}
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);