'use strict';
var express = require('express');
var moment = require('moment');
var crypto = require('crypto');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    var key = "asdhjwheru*asd123-123";//加密的秘钥
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var text = "123|12312312123123121231231212312312123123121231231212312312";
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    var message = crypted;//加密之后的值
    console.log(message);
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var dec = decipher.update(message, 'hex', 'utf8');
    dec += decipher.final('utf8');//解密之后的值

    res.send(dec);
});

module.exports = router;
