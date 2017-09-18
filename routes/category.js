var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Business = require('../models/business');

// API END POINTS

// ADD NEW CATEGORY
router.post('/', function (req, res, next) {
    Category.findOne({"name": req.body.name}, function(err, category) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (category){
            return res.status(401).json({
                title: 'Category exists',
                error: { message: 'This category already exists in database.' }
            });
        }

        var category = new Category({
            name: req.body.name
        });
        category.save(function (err, result) {
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

// GET ALL CATEGORIES
router.get('/', function(req, res, next) {
        Category.find()
            .exec(function(err, categories){
            if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
            if (!categories){
                return res.status(401).json({
                    title: 'No data',
                    error: {
                        message: 'No category found.'
                    }
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: categories
            });
    });
});

// GET CATEGORIES BY BUSINESS_ID
router.get('/:business_id', function(req, res, next) {
    getCategoriesByParams(req.params.business_id, null, res);
});


// EDIT CATEGORY
router.patch('/:id', function(req, res, next) {
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!category) {
            return res.status(500).json({
                title: 'No data',
                error: {
                    message: 'No category found'
                }
            });
        }

        category.name = req.body.name;

        category.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated category',
                obj: result
            });
        });
    });
});

// GET CATEGORIES FUNCTION
function getCategoriesByParams(business_id, coupon_id, res){
    var query = {};
    if (business_id){
        query.business_id = business_id;
    }
    if (coupon_id){
        query.coupon_id = coupon_id;
    }
    Business.findOne({_id: business_id})
        .exec(function (err, business) {
            if (err) {
                return res.status(500).json({
                    title: 'An error ocurred',
                    error: err
                });
            }
            if (business) {
                //find all categories
                //ObjectID = require('mongoose').ObjectID;
                var categoriesIds = business.categories;
                var array = [{
                    _id: 'abcd1234',
                    name: 'key1'
                }];
                Category.find({_id: {$in: categoriesIds}}, function (err, array) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error ocurred',
                            error: err
                        });
                    } else {
                        var objects = {};
                        array.forEach(o => objects[o._id] = o);
                        var categories = categoriesIds.map(id => objects[id]);
                        console.log(categories);
                        res.status(200).json({
                            message: 'Success',
                            obj: categories
                        })
                    }
                });

            }
        });

}

module.exports = router;