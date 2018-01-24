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
    res.render('index', { title: 'HOME', test: res.locals.islogin });
});

router.route('/login')
    .get(function (req, res) {
        //if (req.session.islogin) {
        //    res.locals.islogin = req.session.islogin;
        //}

        //if (req.cookies.islogin) {
        //    req.session.islogin = req.cookies.islogin;
        //}
        //res.render('login', { title: '用户登录', test: res.locals.islogin });
    })
    .post(function (req, res) {
        //var connection = sql.connectServer();
        //var result = null;
        //sql.select(connection, req.body.username, function (result) {
        //    if (result[0] === undefined) {
        //        res.send('没有该用户');
        //    } else {
        //        if (result[0].password === req.body.password) {
        //            req.session.islogin = req.body.username;
        //            res.locals.islogin = req.session.islogin;
        //            res.cookie('islogin', res.locals.islogin, { maxAge: 60000 });
        //            res.redirect('/home');
        //        } else {
        //            res.redirect('/login');
        //        }
        //    }
        //});
    });

router.route('/register')
    .get(function (req, res) {
        res.render('register', { title: '注册' });
    })
    .post(function (req, res) {
        var connection = sql.connectServer();
        sql.insert(connection, req.body.name, req.body.password, function (err) {
            if (err) throw err;
            res.redirect('/');
        });
    });


module.exports = router;