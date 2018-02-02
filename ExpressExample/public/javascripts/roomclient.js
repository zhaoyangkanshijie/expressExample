window.onload = function () {
    
    //var username = '';
    //while ($('#username').text().trim() === '') {
    //    username = prompt("请设置你的昵称", "");
    //    $('#username').text(username);
    //}

    var url = window.location.href;
    var part = url.split('/');
    var roomID = part[part.length - 1];

    $.ajax({
        url: '/getname2?roomID='+roomID,
        type: 'get',
        success: function (username) {
            if (username) {
                // ----------设置昵称-------------
                $('#username').text(username);
                // ---------创建连接-----------
                var socket = io.connect("ws://localhost:3000");

                // 加入房间
                socket.emit('join', username);

                // 监听消息
                socket.on('msg', function (username, msg) {
                    var message = '' +
                        '<div class="message">' +
                        '  <span class="user">' + username + ': </span>' +
                        '  <span class="msg">' + msg + '</span>' +
                        '</div>';
                    $('#msglog').append(message);
                    // 滚动条保持最下方
                    $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
                });

                // 监听系统消息
                socket.on('sys', function (sysMsg, users, action) {
                    var message = '<div class="sysMsg">' + sysMsg + '</div>';
                    $('#msglog').append(message);
                    $('#count').text(users.length);
                    $('#users').text(users);
                });

                // 发送消息
                $('#messageInput').keydown(function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                        var msg = $(this).val();
                        $(this).val('');

                        socket.send(msg);
                    }
                });

                // 退出房间
                $('#joinOrLeave').click(function () {
                    if ($(this).text() === '退出房间') {
                        $(this).text('进入房间');
                        socket.emit('leave');
                        var msg = '你已经退出了房间,重新发言请点击"进入房间"';
                        $('#msglog').append('<div class="sysMsg">' + msg + '</div>');
                    } else {
                        $(this).text('退出房间');
                        socket.emit('join', username);
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