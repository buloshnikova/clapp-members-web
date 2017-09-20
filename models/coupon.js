var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var Business = require('./business');

var schema = new Schema({
    business_id: {type: Schema.Types.ObjectId, ref: 'Business', required: true},
    title: {type: String, required: true},
    barcode_img: {type: String, required: true},
    coupon_type: {type: Schema.Types.ObjectId, ref: 'CouponType', required: true},
    description: {type: String, required: false},
    exp_date: {type: Number},
    start_date: {type: Number},
    img_type: {type: String},
    logo: {type: String},
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    locations: [{type: Schema.Types.ObjectId, ref: 'Location'}]

});

schema.post('remove', function(coupon) {
    Business.findById(coupon.business_id, function(err, business) {

        business.coupons.pull(coupon);
        business.save();
    });
});

// extra validation for a parameter marked as unique:true
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Coupon', schema);