var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    business_id: {type: Schema.Types.ObjectId, ref: 'Business', required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    address_line_1: {type: String},
    address_line_2: {type: String},
    google_maps_url: {type: String},
    coupon_id: [{type: Schema.Types.ObjectId, ref: 'Coupon'}]
});

// extra validation for a parameter marked as unique:true
// email: {type: String, required: true, unique: true}

module.exports = mongoose.model('Location', schema);