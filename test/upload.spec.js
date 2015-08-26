'use strict';

var express = require('express');
var request = require('supertest');
var mock = require('mock-fs');
var app;

describe('Upload ("/upload")', function () {

    beforeEach(function () {
        app = express();
        app.use('/upload', require('../upload'));
    });

    afterEach(function () {
        mock.restore();
    });

    describe('Image too large', function () {

        beforeEach(function () {
            mock({
                'fakefiles': {
                    'small-image.jpg': 'this is the winter of our small contents',
                    'big-image.jpg': new Buffer(20971520) // 20mbish
                }
            });
        });

        it('should give an error message about file size', function (done) {
            var fs = require('fs');
            console.log('Look mum I’m a real file:\n\n', JSON.stringify(fs.statSync('fakefiles/big-image.jpg'), null, 4),'\n\n');

            request(app)
                .post('/upload')
                .attach('image', 'fakefiles/big-image.jpg')
                .end(function(err, res) {
                    res.status.should.equal(500);
                    res.error.text.should.match(/Error: File is too large/);
                    done();
                });
        });
    });

});
