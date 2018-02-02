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
    res.render('roomchat');
}).post(function (req, res) {

});

router.route('/:name').get(function (req, res) {
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

    var roomID = req.params.name;
    //if (global.roomInfo[roomID] == undefined) {
    //    global.roomInfo[roomID] = [];
    //    global.roomInfo[roomID].push(name);
    //}
    //else {
    //    if (global.roomInfo[roomID].indexOf(name) == -1) {
    //        global.roomInfo[roomID].push(name);
    //    }
    //}

    //console.log("after check",roomID);
    //console.log("after check",global.roomInfo[roomID]);
    res.render('room', { 'name': name, 'roomID': roomID });
}).post(function (req, res) {

});

router.param('name', function (req, res, next, name) {
    // 对name进行验证或其他处理……
    //console.log("check room name",name);
    var reg = /^room_[0-9]+[1-9]*$/;
    var ok = reg.test(name);
    console.log("ok?", ok);
    if (ok) {
        next();
    }
    else {
        res.redirect('/roomchat');
    }
});

module.exports = router;