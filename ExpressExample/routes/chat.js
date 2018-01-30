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
        res.redirect('login');
    }

    res.render('chat');
}).post(function (req, res) {

});

//ajax
router.route('/getname').get(function (req, res) {
    var name;
    if (req.session.name) {
        name = res.locals.name = req.session.name;
    }
    else if (req.cookies.name) {
        name = req.session.name = req.cookies.name;
    }
    else {
        res.redirect('login');
    }
    res.send(name);
})


module.exports = router;