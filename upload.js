'use strict';

var express = require('express');
var upload = require('multer')({ dest: 'public/images' });

var router = module.exports = express.Router();

router.post('/', upload.single('image'), function (req, res, next) {

    if (!req.file) {
        res.status(500).send('Error: Please attach a file');
    }
    if (req.file.size < 10485760) {
        res.status(200).send('file size is smaller than 10mb');
    } else {
        res.status(500).send('Error: File is too large');
    }
});
