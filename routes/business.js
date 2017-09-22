var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Business = require('../models/business');
var Location = require('../models/location');

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
        var token = jwt.sign({ business: business}, 'secretkey', {expiresIn:72000000});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            business: business
        });
    });

});

// CHANGE PASSWORD
router.patch('/changepass', function(req, res, next) {
    jwt.verify(req.query.token, 'secretkey', function(err, decoded) {
        if(err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        //next();
    Business.findOne({_id: req.body._id}, function (err, business) {
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
                title: 'Old password checking failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        // save a new password to the existing object
        business.password = bcrypt.hashSync(req.body.new_password, 10);
        business.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error ocurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Password updated',
                obj: {
                    message: 'Password has been changed.'
                }
            });
        });
    });

    });

});


// GET BUSINESS DATA
router.get('/:business_id', function(req, res, next) {
    jwt.verify(req.query.token, 'secretkey', function(err, decoded) {
        if(err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        Business.findOne({_id: req.params.business_id})
            .populate('locations')
            .exec(function (err, business) {
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
                        message: 'Invalid business id'
                    }
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: business
            });
        });
    });
});


// EDIT BUSINESS DATA
router.patch('/:id', function(req, res, next) {
    //var decoded = jwt.decode(req.query.token);
    jwt.verify(req.query.token, 'secretkey', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        //next();
        Business.findById(req.params.id, function (err, business) {
            if (err) {
                return res.status(500).json({
                    title: 'An error ocurred',
                    error: err
                });
            }
            if (!business) {
                return res.status(500).json({
                    title: 'No User Found',
                    error: {
                        message: 'User not found'
                    }
                });
            }
            // save locations

            var locations = (req.body.locations) ? req.body.locations.map(function(item){
                return item;
            }) : [];
            // temporally, remove checking when client is done
            if (req.body.locations) {
                Location.find({business_id: req.params.id}).remove().exec();
            }

            Location.insertMany(locations, function(err, location_ids){
                location_ids.map((loc) => {
                    return loc._id;
                });

                // save business

                business.title = req.body.title;
                business.info = req.body.info;
                business.logo = req.body.logo;
                business.categories = req.body.categories;
                business.locations = location_ids;
                business.coupons = req.body.coupons;

                console.log(business);
                business.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error ocurred',
                            error: err
                        });
                    }
                    res.status(200).json({
                        message: 'Updated Business',
                        obj: result
                    });
                });
            });

        });
    });
});

module.exports = router;