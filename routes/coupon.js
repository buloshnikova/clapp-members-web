var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Coupon = require('../models/coupon');
var User = require('../models/user');
var Business = require('../models/business');

// API END POINTS
router.get('/', function(req, res, next) {
    Coupon.find()
        .populate('business', 'title')
        .exec(function(err, coupons) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: coupons
            });
        });
});

router.post('/', function(req, res, next) {
    var coupon = new Coupon({
        business_id: req.body.business_id,
        title: req.body.title,
        description: req.body.description,
        exp_date: req.body.exp_date,
        start_date: req.body.start_date,
        barcode_img: req.body.barcode_img,
        img_type: req.body.img_type,
        logo: req.body.logo
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

router.patch('/:id', function(req, res, next){
   Message.findById(req.params.id, function(err, coupon) {
       if (err) {
           return res.status(500).json({
               title: 'An error occurred',
               error: err
           });
           if (!coupon){
               return res.status(500).json({
                   title: 'No Coupon Found',
                   error: { message: 'Coupon Not Found'}
               });
           }
           //compose message
           message.title = req.body.title;
           message.description = req.body.description;
           message.exp_date = req.body.exp_date;
           message.start_date = req.body.start_date;
           message.barcode_img = req.body.barcode_img;
           message.img_type = req.body.img_type;
           message.logo = req.body.logo;
           //save message to DB
           message.save( function(err, result) {
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
       }

   });
});

router.delete('/:id', function(req, res, next){
    Message.findById(req.params.id, function(err, coupon) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
            if (!coupon){
                return res.status(500).json({
                    title: 'No Coupon Found',
                    error: { message: 'Coupon Not Found'}
                });
            }
            message.remove( function(err, result) {
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
        }

    });
});

module.exports = router;