'use strict';
var express = require('express');
var router = express.Router();
var app = express();

router.route('/').get(function (req, res) {
    var name;
    if (req.session.name) {
        name = res.locals.name = req.session.name;
    }
    else if (req.cookies.name) {
        name = req.session.name = req.cookies.name;
    }
    else {
        res.redirect('/login');
    }
    //console.log(req.sessionID);
    //req.sessionStore.post(req.body.name, function (error, session) {
    //    // 如果session存在，表示用户已在其他地方登录
    //    if (session) {
    //        res.redirect('/');
    //    }
    //});
    res.render('chat');
}).post(function (req, res) {

});




module.exports = router;