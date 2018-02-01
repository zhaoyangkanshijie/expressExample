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
var upload = require("./routes/upload");
var roomchat = require('./routes/roomchat');

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
    //genid: function (req) {
    //    return req.body.name; // 生成session的id
    //}
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
app.use('/upload', upload);
app.use('/roomchat', roomchat);

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
global.onlineUser = [];
global.onlineCount = 0;

io.on('connection', function (socket) {
    console.log('新用户登录');

    //监听新用户加入
    socket.on('login', function (name) {
        socket.name = name;
        //检查用户在线列表
        var inArray = isInArray(onlineUser, name);
        if (!inArray) {
            onlineUser.push(name);
            //在线人数+1
            onlineCount++;
        }
        //广播消息
        io.emit('login', { onlineUser: onlineUser, onlineCount: onlineCount, user: name });
        console.log(name + "加入了聊天室");
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

// 房间用户名单
global.roomInfo = [];

io.on('connection', function (socket) {
    // 获取请求建立socket连接的url
    // 如: http://localhost:3000/room/room_1, roomID为room_1
    var url = socket.request.headers.referer;
    var splited = url.split('/');
    var roomID = splited[splited.length - 1];   // 获取房间ID
    var user = '';

    socket.on('join', function (userName) {
        user = userName;

        // 将用户昵称加入房间名单中
        if (!roomInfo[roomID]) {
            roomInfo[roomID] = [];
        }
        roomInfo[roomID].push(user);

        socket.join(roomID);    // 加入房间
        // 通知房间内人员
        socketIO.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);
        console.log(user + '加入了' + roomID);
    });

    socket.on('leave', function () {
        socket.emit('roomdisconnect');
    });

    socket.on('roomdisconnect', function () {
        // 从房间名单中移除
        var index = roomInfo[roomID].indexOf(user);
        if (index !== -1) {
            roomInfo[roomID].splice(index, 1);
        }

        socket.leave(roomID);    // 退出房间
        socketIO.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
        console.log(user + '退出了' + roomID);
    });

    // 接收用户消息,发送相应的房间
    socket.on('message', function (msg) {
        // 验证如果用户不在房间内则不给发送
        if (roomInfo[roomID].indexOf(user) === -1) {
            return false;
        }
        socketIO.to(roomID).emit('msg', user, msg);
    });
});


//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function () {
//    debug('Express server listening on port ' + server.address().port);
//});
http.listen(3000, function () {
    //console.log('listening on *:3000');
});