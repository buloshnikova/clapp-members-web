var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Business = require('../models/business');

// API END POINTS

// SIGN UP
router.post('/signup', function (req, res, next) {
    var business = new Business({

        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        title: req.body.title

    });
    business.save(function (err, result){
        if (err) {
            return res.status(500).json({
                title: 'An error ocurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'Business Created',
            obj: result
        });
    });
});

// SIGN IN
router.post('/signin', function(req, res, next) {
    Business.findOne({email: req.body.email}, function (err, business) {
        if (err) {
            return res.status(500).json({
                title: 'An error ocurred',
                error: err
            });
        }
        if (!business) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        if (!bcrypt.compareSync(req.body.password, business.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        var token = jwt.sign({ business: business}, 'secretkey', {expiresIn:7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            businessId: business._id
        });
    });

});

// EDIT BUSINESS DATA
router.patch('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function(err, business){
        if(err) {
            return res.status(500).json({
                title: 'An error ocurred',
                error: err
            });
        }
        if (!business) {
            return res.status(500).json({
                title: 'No User Found',
                error: {message: 'User not found'}
            });
        }
        //if (business._id !== decoded.user._id) {
        //    return res.status(401).json({
        //        title: 'Not Authenticated',
        //        error: {message: 'Users do not match'}
        //    });
        //}
        business.title = req.body.title;
        business.description = req.body.description;
        business.logo = req.body.logo;
        business.categories = req.body.categories;
        business.locations = req.body.locations;
        business.coupons = req.body.coupons;

        business.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error ocurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated Message',
                obj: result
            });
        });
    });
});

module.exports = router;