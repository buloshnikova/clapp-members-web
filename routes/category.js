var express = require('express');
var router = express.Router();

var Category = require('../models/category')

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
                    title: 'An error ocurred',
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

module.exports = router;