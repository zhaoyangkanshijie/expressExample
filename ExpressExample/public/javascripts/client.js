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
        url: '/getname',
        type: 'get',
        success: function (username) {
            if (username) {
                console.log(username);
                //连接socket后端服务器(登录本地3000端口，会导致异地通信失效)
                var socket = io.connect(/*"ws://localhost:3000", { 'force new connection': false }*/);
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
                    //var message = encode10(clientMessage.content);
                    var message = decrypt(clientMessage.content);
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
                    $('title').html('message+1');
                    $('.main-body').scrollTop(99999);
                });
                $('.send').click(function () {
                    var content = $('input[name="msg"]').val().toString();
                    if (content) {
                        //content = encode8(content);
                        content = encrypt(content);
                        var clientMessage = {
                            'name': username,
                            'content': content
                        }
                        socket.emit('message', clientMessage);
                        $('input[name="msg"]').val("");
                    }
                });
                $('#msg').keydown(function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        var content = $('input[name="msg"]').val().toString();
                        if (content) {
                            //content = encode8(content);
                            content = encrypt(content);
                            var clientMessage = {
                                'name': username,
                                'content': content
                            }
                            socket.emit('message', clientMessage);
                            $('input[name="msg"]').val("");
                        }
                    }
                });
                $('#reset').on('click', function () {
                    $('title').html('chat');
                    $('.user,.server').remove();
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

function encrypt(str, pwd) {
    if (str == '') {
        return '';
    }
    str = encodeURIComponent(str);
    if (!pwd || pwd == '') {
        pwd = 'kb1234a';
    }
    pwd = encodeURIComponent(pwd);
    if (pwd == '' || pwd.length <= 0) {
        return '';
    }
    var prand = '';
    for (var i = 0, len = pwd.length; i < len; i += 1) {
        prand += pwd.charCodeAt(i).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
        prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
        return '';
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) +
            parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var encChr = '';
    var encStr = '';
    for (var i = 0, len = str.length; i < len; i += 1) {
        encChr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
        if (encChr < 16) {
            encStr += '0' + encChr.toString(16);
        } else {
            encStr += encChr.toString(16);
        }
        prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) {
        salt = "0" + salt;
    }
    encStr += salt;
    return encStr;
}

function decrypt(str, pwd) {
    if (str == '') {
        return '';
    }
    if (!pwd || pwd == '') {
        pwd = 'kb1234a';
    }
    pwd = encodeURIComponent(pwd);
    if (str == undefined || str.length < 8) {
        return '';
    }
    if (pwd == undefined || pwd.length <= 0) {
        return '';
    }
    var prand = '';
    for (var i = 0, len = pwd.length; i < len; i += 1) {
        prand += pwd.charCodeAt(i).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
        prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) +
            parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var encChr = '';
    var encStr = '';
    for (var i = 0, len = str.length; i < len; i += 2) {
        encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
        encStr += String.fromCharCode(encChr);
        prand = (mult * prand + incr) % modu;
    }
    return decodeURIComponent(encStr);
}

window.onfocus = function () {
    $('title').html('chat');
}
window.onblur = function () {
    $('title').html('chat');
}