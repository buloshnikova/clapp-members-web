var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Coupon = require('../models/coupon');
var ErrorConstant = require('../utils/error.variables');

// API END POINTS

// SIGN UP
router.post('/signup', function (req, res, next) {
    var user = new User({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function (err, user){
        if (err) {
            return res.status(500).json({
                title: 'An error ocurred',
                error: err
            });
        }
        console.log(user);
        var token = jwt.sign({ user: user}, 'secretkey', {expiresIn:7200});
        res.status(201).json({
            message: 'User Created',
            token: token,
            userId: user._id
        });
    });
});

// SIGN IN
router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error ocurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        var token = jwt.sign({ user: user}, 'secretkey', {expiresIn:7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        });
    });

});

// TEMPORARY
// GET COUPONS FOR AN ANONYMOUS USER
router.get('/', function(req, res, next) {

    // TODO: should be performed a user verification before fetching coupons
    //var decoded = jwt.decode(req.query.token);
    //console.log(decoded);
    //
    //if (req.params.business_id != decoded.business._id) {
    //    console.log(categories);
    //
    //    return res.status(ErrorConstant.WRONG_CREDENTIALS).json({
    //        title: 'Not Authenticated',
    //        error: { message: 'Business is not authenticated' }
    //    });
    //}
    Coupon.find()
        .populate('categories locations coupon_type business_id')
        .exec(function(err, coupons) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (coupons[0] == null)
                return res.status(ErrorConstant.NO_DATA_FOUND).json({
                    title: 'Nothing to show',
                    error: { message: 'There are no coupons yet' }
                });
            console.log(coupons);
            res.status(ErrorConstant.SUCCESS).json({
                message: 'Success',
                obj: coupons
            });
        });
});

// ADD NEW PRIVATE COUPON
router.post('/', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Business.findById(req.body.business_id, function (err, business) {
        if (err) {
            return res.status(ErrorConstant.WRONG_CREDENTIALS).json({
                title: 'Not Authenticated',
                error: { message: 'Business is not authenticated' }
            });
        }
        if (req.body.business_id != decoded.business._id)
            return res.status(ErrorConstant.WRONG_CREDENTIALS).json({
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
                return res.status(ErrorConstant.GENERAL_ERROR).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(ErrorConstant.DATA_SAVED).json({
                message: 'Saved',
                obj: result
            });
        });
    });
});

module.exports = router;