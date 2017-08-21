var express = require('express');
var router = express.Router();

var CouponType = require('../models/coupon_type');

// API END POINTS

// ADD NEW COUPON_TYPE
router.post('/', function (req, res, next) {
    CouponType.findOne({"name": req.body.name}, function(err, coupon_type) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (coupon_type){
            return res.status(401).json({
                title: 'Coupon type exists',
                error: { message: 'This coupon type already exists in database.' }
            });
        }

        var coupon_type = new CouponType({
            name: req.body.name,
            type: req.body.type
        });
        coupon_type.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Saved',
                obj: result
            });
        });

    });

});

// GET ALL COUPON_TYPES
router.get('/', function(req, res, next) {
    CouponType.find()
        .exec(function(err, coupon_types){
            if (err) {
                return res.status(500).json({
                    title: 'An error ocurred',
                    error: err
                });
            }
            if (!coupon_types){
                return res.status(401).json({
                    title: 'No data',
                    error: {
                        message: 'No coupon type found.'
                    }
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: coupon_types
            });
        });
});

// EDIT COUPON_TYPE
router.patch('/:id', function(req, res, next) {
    CouponType.findById(req.params.id, function (err, coupon_type) {
        if (err) {
            return res.status(500).json({
                title: 'An error ocurred',
                error: err
            });
        }
        if (!coupon_type) {
            return res.status(500).json({
                title: 'No data',
                error: {
                    message: 'No coupon type found'
                }
            });
        }

        coupon_type.name = req.body.name;
        coupon_type.type = req.body.type;

        coupon_type.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error ocurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated coupon type',
                obj: result
            });
        });
    });
});

// DELETE COUPON_TYPE

module.exports = router;