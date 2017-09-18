var express = require('express');
var router = express.Router();

var Location = require('../models/location');

// GET ALL LOCATIONS
router.get('/', function(req, res, next) {
    getLocationsByParams(null, null, res);
});

// GET LOCATIONS BY BUSINESS_ID
router.get('/:business_id', function(req, res, next) {
    getLocationsByParams(req.params.business_id, null, res);
});

// GET LOCATIONS BY BUSINESS_ID AND COUPON_ID
router.get('/:business_id/:coupon_id', function(req, res, next) {
    getLocationsByParams(req.params.business_id, req.params.coupon_id, res);
});

// GET LOCATIONS FUNCTION
function getLocationsByParams(business_id, coupon_id, res){
    var query = {};
    if (business_id){
        query.business_id = business_id;
    }
    if (coupon_id){
        query.coupon_id = coupon_id;
    }
    Location.find(query, function(err, locations) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!locations){
                return res.status(401).json({
                    title: 'No data',
                    error: {
                        message: 'No location found.'
                    }
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: locations
            })
        });
}

module.exports = router;
