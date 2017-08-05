var express = require('express');
var router = express.Router();

var Category = require('../models/category')

// API END POINTS

router.post('/', function (req, res, next) {
    console.log(req.body);
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

module.exports = router;