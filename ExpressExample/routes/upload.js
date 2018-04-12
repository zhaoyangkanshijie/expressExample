'use strict';
var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
//var multer = require('multer');
var formidable = require('formidable');
//var upload = multer({ dest: '/images/' });

router.route('/').get(function (req, res) {
    

    res.render('upload');
}).post(function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/images/';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {
        //console.log(fields);
        console.log(files);

        if (err) {
            res.send('upload error');
        }

        var extName = '';  //后缀名
        switch (files.uploadFile.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length == 0) {
            res.send('you can just upload images');
        }
        else {
            var newPath = form.uploadDir + files.uploadFile.name;
            fs.renameSync(files.uploadFile.path, newPath);  //重命名
            res.json({
                'url': '/images/' + files.uploadFile.name
            });
        }
    });
});

router.route('/progress').get(function (req, res) {


    res.render('upload');
}).post(function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/file/';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2000 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {
        //console.log(fields);
        console.log(files);

        if (err) {
            res.send('upload error');
        }
        else {
            var newPath = form.uploadDir + files.myfile.name;
            fs.renameSync(files.myfile.path, newPath);  //重命名
            res.send('ok');
        } 
    });
});

module.exports = router;