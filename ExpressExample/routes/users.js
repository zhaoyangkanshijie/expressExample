'use strict';
var express = require('express');
var moment = require('moment');
var crypto = require('crypto');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    var password = "111";
    var md5 = crypto.createHash('md5');
    var timeByFormat = moment().format('YYYY-MM-DD HH:mm:ss');
    var encrypt = md5.update(password).digest('hex');
    //var encrypt = md5.update(password).update(timeByFormat).digest('hex');
    var decipher = crypto.createDecipher('md5', password);

    //const decipher = crypto.createDecipher('aes192', 'a password');

    //const encrypted = 'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log(decrypted);
    res.send('respond with a resource');
});

module.exports = router;
