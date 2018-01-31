'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var index = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');

//传入了一个密钥加session id
app.use(cookieParser("An"));
//session使用就靠这个中间件
app.use(session({
    secret: 'an',// 用来对session id相关的cookie进行签名
    resave: false,// 是否每次都重新保存会话，建议false
    saveUninitialized: false,// 是否自动保存未初始化的会话，建议false
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function isInArray(arr, name) {
    var inArray = false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == name) {
            inArray = true;
            break;
        }
    }
    return inArray;
}

function deleteByValue(arr, name) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == name) {
            arr.splice(i, 1);
            break;
        }
    }
}

//在线用户
var onlineUser = [];
var onlineCount = 0;

io.on('connection', function (socket) {

    //监听新用户加入
    socket.on('login', function (name) {
        // socket.name = name;
        // //检查用户在线列表
        // var inArray = isInArray(onlineUser, name);
        // if (!inArray) {
        //     onlineUser.push(name);
        //     //在线人数+1
        //     onlineCount++;
        // }

        // //广播消息
        // io.emit('login', { onlineUser: onlineUser, onlineCount: onlineCount, user: name });
        // console.log(name + "加入了聊天室");
        if (onlineUser.indexOf(name) > -1) {
            socket.emit('nickExisted');
            socket.name = name;
            io.emit('login', { onlineUser: onlineUser, onlineCount: onlineUser.length, user: name });
        } else {
            //socket.userIndex = users.length;
            console.log('新用户正在登录');
            socket.name = name;
            onlineUser.push(name);
            socket.emit('loginSuccess');
            console.log('新用户登录成功');
            console.log(name + "加入了聊天室");

            //onlineCount++;
            io.emit('login', { onlineUser: onlineUser, onlineCount: onlineUser.length, user: name });
        };
    });

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出用户在在线列表删除
        var inArray = isInArray(onlineUser, socket.name);
        if (inArray) {
            //退出用户信息
            var name = socket.name;
            //删除
            deleteByValue(onlineUser, socket.name);
            //在线人数-1
            onlineCount--;
            //广播消息
            io.emit('logout', { onlineUser: onlineUser, onlineCount: onlineCount, user: name });
            console.log(name + "退出了聊天室");
        }
    });

    //监听用户发布聊天内容
    socket.on('message', function (clientMessage) {
        //向所有客户端广播发布的消息
        io.emit('message', clientMessage);
        console.log(clientMessage.name + '说：' + clientMessage.content);
    });
});



//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function () {
//    debug('Express server listening on port ' + server.address().port);
//});
http.listen(3000, function () {
    console.log('listening on *:3000');
});