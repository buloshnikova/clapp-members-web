var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Coupon = require('../models/coupon');
var User = require('../models/user');
var Business = require('../models/business');
var CouponType = require('../models/coupon_type');

// API END POINTS

// VERIFICATION
router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secretkey', function(err, decoded) {
        if(err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    });
});

// GET ALL COUPONS BY BUSINESS ID
router.get('/:business_id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    if (req.params.business_id != decoded.business._id)
        return res.status(401).json({
            title: 'Not Authenticated',
            error: { message: 'Business is not authenticated' }
        });
    Coupon.find({business_id: req.params.business_id})
        .populate('categories locations coupon_type')
        .exec(function(err, coupons) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!coupons[0] && coupons[0].business_id != decoded.business_id)
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: { message: 'Business is not authenticated' }
                });
            console.log(coupons);
            res.status(200).json({
                message: 'Success',
                obj: coupons
            });
        });
});

// GET ONE COUPON BY COUPON ID
router.get('/:business_id/:coupon_id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    if (req.params.business_id != decoded.business._id)
        return res.status(401).json({
            title: 'Not Authenticated',
            error: { message: 'Business is not authenticated' }
        });
    Coupon.findById({id: req.params.coupon_id})
        .populate('categories locations coupon_type')
        .exec(function(err, coupons) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!coupons[0] && coupons[0].business_id != decoded.business_id)
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: { message: 'Business is not authenticated' }
                });
            res.status(200).json({
                message: 'Success',
                obj: coupons
            });
        });
});


// ADD NEW COUPON
router.post('/', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Business.findById(req.body.business_id, function (err, business) {
       if (err) {
           return res.status(401).json({
               title: 'Not Authenticated',
               error: { message: 'Business is not authenticated' }
           });
        }
        if (req.body.business_id != decoded.business._id)
            return res.status(401).json({
                title: 'Not Authenticated',
                error: { message: 'Business is not authenticated' }
            });
        //another way to save array if a parameter contains _id only
        //var categories = req.body.categories;
        //var locations = req.body.locations;
        var coupon = new Coupon({
            business_id: req.body.business_id,
            title: req.body.title,
            description: req.body.description,
            exp_date: req.body.exp_date,
            start_date: req.body.start_date,
            barcode_img: req.body.barcode_img,
            img_type: req.body.img_type,
            logo: req.body.logo,
            coupon_type: req.body.coupon_type,
            categories: req.body.categories.map(function(item){
                return item._id;
            }),
            locations: req.body.locations.map(function(item){
                return item._id;
            })
        });
        coupon.save(function(err, result){
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

// UPDATE COUPON
router.patch('/:id', function(req, res, next){
    var decoded = jwt.decode(req.query.token);
    Coupon.findById(req.params.id, function(err, coupon) {
       if (err) {
           return res.status(500).json({
               title: 'An error occurred',
               error: err
           });
       }
       if (!coupon){
           return res.status(500).json({
               title: 'No Coupon Found',
               error: { message: 'Coupon Not Found'}
           });
       }
       if (coupon.business_id != decoded.business._id)
           return res.status(401).json({
               title: 'Not Authenticated',
               error: { message: 'Business is not authenticated' }
           });
       //compose coupon
       //coupon.business_id = req.body.business_id;
       coupon.title = req.body.title;
       coupon.description = req.body.description;
       coupon.exp_date = req.body.exp_date;
       coupon.start_date = req.body.start_date;
       coupon.barcode_img = req.body.barcode_img;
       coupon.img_type = req.body.img_type;
       coupon.logo = req.body.logo;
       coupon.coupon_type = req.body.coupon_type;
       coupon.categories = req.body.categories.map(function(item){
           return item._id;
       });
       coupon.locations = req.body.locations.map(function(item){
           return item._id;
       });

       //save coupon to DB
       coupon.save( function(err, result) {
           if (err) {
               return res.status(500).json({
                   title: 'An error occurred',
                   error: err
               });
           }
           res.status(200).json({
               message: 'Updated',
               obj: result
           });
       });
   });
});

// DELETE COUPON
router.delete('/:id', function(req, res, next){
    var decoded = jwt.decode(req.query.token);
    Coupon.findById(req.params.id, function(err, coupon) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!coupon){
            return res.status(500).json({
                title: 'No Coupon Found',
                error: { message: 'Coupon Not Found'}
            });
        }
        if (coupon.business_id != decoded.business._id)
            return res.status(401).json({
                title: 'Not Authenticated',
                error: { message: 'Business is not authenticated' }
            });
        var query = { _id: coupon._id };
        Coupon.remove(query, function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted',
                obj: result
            });
        });

    });
});

module.exports = router;