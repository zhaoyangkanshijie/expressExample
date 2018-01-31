/*按钮点击效果*/
$('.send').mousedown(function () {
    $(this).css({ 'background': "#007aff", 'color': "#ffffff" });
});
$('.send').mouseup(function () {
    $(this).css({ 'background': "#e8e8e8", 'color': "#ffffff" });
});

/*socket*/
window.onload = function () {
    //获取用户名
    $.ajax({
        url: '/chat/getname',
        type: 'get',
        success: function (username) {
            if (username) {
                console.log(username);
                //连接socket后端服务器
                var socket = io.connect("ws://localhost:3000", { 'force new connection': false });
                //通知用户有用户登录
                socket.emit('login', username);
                //监听新用户登录
                socket.on('login', function (serverLoginInfo) {
                    updateMsg(serverLoginInfo, 'login');
                });
                //监听用户退出
                socket.on('logout', function (serverLogoutInfo) {
                    updateMsg(serverLogoutInfo, 'logout');
                });
                //发送消息
                socket.on('message', function (clientMessage) {
                    var message = encode10(clientMessage.content);
                    if (clientMessage.name == username) {
                        var MsgHtml = '<section class="user clearfix">'
                            + '<span>' + clientMessage.name + '</span>'
                            + '<div>' + message + '</div>'
                            + '</section>';
                    } else {
                        var MsgHtml = '<section class="server clearfix">'
                            + '<span>' + clientMessage.name + '</span>'
                            + '<div>' + message + '</div>'
                            + '</section>';
                    }
                    $('.main-body').append(MsgHtml);
                    $('.main-body').scrollTop(99999);
                });
                $('.send').click(function () {
                    var content = $('input[name="msg"]').val().toString();
                    if (content) {
                        content = encode8(content);
                        var clientMessage = {
                            'name': username,
                            'content': content
                        }
                        socket.emit('message', clientMessage);
                        $('input[name="msg"]').val("");
                    }
                });
            }
            else {
                window.close();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function logout() {
    socket.disconnect();
    location.reload();
}
/*监听函数*/
function updateMsg(serverInfo, action) {
    //当前在线列表
    var onlineUser = serverInfo.onlineUser;
    //当前在线数
    var onlineCount = serverInfo.onlineCount;
    //新加用户
    var name = serverInfo.user;
    //更新在线人数
    var userList = '';
    var separator = '';
    for (var i = 0; i < onlineUser.length;i++) {
        userList += separator + onlineUser[i];
        separator = '、';
    }
    //跟新房间信息
    $('.chatNum').text(onlineCount);
    $('.chatList').text(userList);
    //系统消息
    if (action == 'login') {
        var sysHtml = '<section class="chatRoomTip"><div>' + name + '进入聊天室</div></section>';
    }
    if (action == "logout") {
        var sysHtml = '<section class="chatRoomTip"><div>' + name + '退出聊天室</div></section>';
    }
    $(".main-body").append(sysHtml);
    $('.main-body').scrollTop(99999);
}

function encode8(content) {
    var result = "";
    for (var i = 0; i < content.length; i++) {
        result += String.fromCharCode(content.charCodeAt(i).toString(8));
        //var str = content.charCodeAt(i);
        //console.log("a的asc："+str);
        //var ten2eight = str.toString(8);
        //console.log("a的asc8进制数：" +ten2eight);
        //var res = String.fromCharCode(ten2eight);
        //console.log("a的asc8进制数当10进制："+res);

        //var str2 = res.charCodeAt();
        //console.log("a的asc10进制数当8进制数：" +str2);
        //var eight2ten = parseInt(str2, 8);
        //console.log("a的asc10进制数：" +eight2ten);
        //var res2 = String.fromCharCode(eight2ten);
        //console.log("a：" + res2);
    }
    return result;
}

function encode10(content) {
    var result = "";
    for (var i = 0; i < content.length; i++) {
        result += String.fromCharCode(parseInt(content.charCodeAt(i), 8));
    }
    return result;
}