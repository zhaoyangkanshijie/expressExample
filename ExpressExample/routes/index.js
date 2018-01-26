'use strict';
var express = require('express');
var sql = require('../routes/sql');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    
    //if (req.cookies.islogin) {
    //    req.session.islogin = req.cookies.islogin;
    //}
    //if (req.session.islogin) {
    //    res.locals.islogin = req.session.islogin;
    //}
    //console.log(req.cookies.islogin);
    res.render('index', { title: 'home', islogin: res.locals.islogin });
});

router.route('/login')
    .get(function (req, res) {
        //if (req.session.islogin) {
        //    res.locals.islogin = req.session.islogin;
        //}

        //if (req.cookies.islogin) {
        //    req.session.islogin = req.cookies.islogin;
        //}
        res.render('login', { title: 'login', islogin: res.locals.islogin });
    })
    .post(function (req, res) {
        var connection = sql.connectServer();
        sql.select(connection, req.body.name, function (results) {

            if (results[0] === undefined) {
                res.render('login', { "message": "not exist name" })
            } else {

                //密码加（解）密实现
                //...
                
                if (results[0].password === req.body.password) {
                    //req.session.islogin = req.body.name;
                    //res.locals.islogin = req.session.islogin;

                    //console.log(req.session.islogin);
                    //console.log(res.locals.islogin);

                    ////记住密码
                    //if (res.body.remember == "checked") {
                    //    console.log("checked");
                    //    res.cookie('islogin', { "name": res.body.name, "password": res.body.password }, { maxAge: 60000 });
                    //} else {
                    //    console.log("not checked");
                    //    res.cookie('islogin', { "name": res.body.name }, { maxAge: 60000 });
                    //}

                    //res.redirect('/');
                    res.render('login', { "message": "ok" });
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
        //...

        sql.insert(connection, req.body.name, req.body.password, function (msg) {
            if (msg != "ok") {
                console.log("error:" + msg);
                res.render('register', { "message": "name is used" });
            } else {
                res.render('register', { "message": "ok" });
                //res.redirect('/');
            }
        });
    });


module.exports = router;