var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var imgUploadUrl = 'public/upload/img/';

router.post('/img', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let sampleFile = req.files.image;
    console.log(req.files.image);

    //let filename = uuid.vi({
    //    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
    //    clockseq: 0x1234,
    //    msecs: new Date('2011-11-01').getTime(),
    //    nsecs: 5678
    //});

    let filename = req.files.image.name;
    sampleFile.mv(imgUploadUrl + filename , function(err) {
        if (err){
            console.log(err)
            return res.status(500).send(err);
        }

        res.status(201).json({
            message: 'File uploaded',
            filename : __dirname + '/../' + imgUploadUrl + filename
        });
        //res.send('File uploaded!');
    });
});


module.exports = router;