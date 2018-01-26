'use strict';
var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var sql = require('../routes/sql');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.name) {
        res.locals.name = req.session.name;
    }
    if (req.cookies.name) {
        req.session.name = req.cookies.name;
    }
    res.render('index', { "title": 'home', "name": res.locals.name });
});

router.route('/login')
    .get(function (req, res) {
        if (req.session.name) {
            res.locals.name = req.session.name;
        }
        if (req.cookies.name) {
            req.session.name = req.cookies.name;
        }
        res.render('login', { title: 'login', "name": res.locals.name });
    })
    .post(function (req, res) {
        var connection = sql.connectServer();
        
        sql.select(connection, req.body.name, function (results) {

            if (results[0] === undefined) {
                res.render('login', { "message": "not exist name" })
            } else {

                //密码加（解）密实现
                var md5 = crypto.createHash('md5');   //crypto模块功能是加密并生成各种散列,此处所示为MD5方式加密
                //console.log("result:" + results[0].time);
                var timeByFormat = moment(results[0].time).format('YYYY-MM-DD HH:mm:ss');
                //console.log("moment:" + timeByFormat);
                var encrypt = md5.update(req.body.password).update(timeByFormat).digest('hex');//加密后的密码
                
                if (results[0].password === encrypt) {
                    req.session.name = req.body.name;
                    //设置通过cookie-parser秘钥加密的cookie，写入客户端
                    res.locals.name = req.session.name;
                    //记住密码交给浏览器，登录状态交给name
                    //req.session.password = req.body.password;
                    //res.locals.password = req.session.password;

                    //记住密码
                    //无需记住密码，直接通过cookie和session登录
                    //if (req.body.remember != undefined) {
                    //    console.log("checked");
                    //    //response后，客户端cookie会保存明文内容，不安全，故用session保存，通过res.locals加密后，保存到客户端cookie
                    //    //res.cookie('islogin', { "name": req.body.name, "password": req.body.password }, { maxAge: 60000 });
                    //} else {
                    //    console.log("not checked");
                    //    //res.cookie('islogin', { "name": req.body.name }, { maxAge: 60000 });
                    //}

                    res.redirect('/');
                    //res.render('index', { "message": "ok", "name": res.locals.name });
                } else {
                    res.render('login', { "message": "password invalid" });
                }
            }
        });
    });

router.route('/register')
    .get(function (req, res) {
        res.render('register', { title: 'register' });
    })
    .post(function (req, res) {
        var connection = sql.connectServer();

        //密码加密实现
        var md5 = crypto.createHash('md5');   //crypto模块功能是加密并生成各种散列,此处所示为MD5方式加密
        //var timeBySecond = moment();
        var timeByFormat = moment().format('YYYY-MM-DD HH:mm:ss');
        var encrypt = md5.update(req.body.password).update(timeByFormat).digest('hex');//加密后的密码

        sql.insert(connection, req.body.name, encrypt, timeByFormat, function (msg) {
            if (msg != "ok") {
                console.log("error:" + msg);
                res.render('register', { "message": "name is used" });
            } else {
                //res.render('register', { "message": "ok" });
                req.session.name = req.body.name;
                res.locals.name = req.session.name;
                res.redirect('/');
            }
        });
    });


module.exports = router;