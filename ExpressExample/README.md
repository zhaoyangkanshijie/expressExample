# ExpressExample

node app
浏览器：localhost：3000

## 首页 （/）

根据session，显示p Hello 名字，没登录，名字为visitor

## 登录 （/login）

连接数据库，校验登录信息。<br>
其中，密码通过时间进行md5加密。<br>
登录后记录session，需要session秘钥和中间件。

## 注册 （/register）

连接数据库。<br>
密码通过时间进行md5加密。<br>
注册后记录session。

## 获取姓名 （/getname）ajax

获取session姓名

## 聊天室 （/chat）

检查用户名<br>
websocket
* connection 提示用户加入，显示在线列表
* disconnect 提示用户退出
* message 广播信息，加密通信

其它
* 为传图方便，开放跨域攻击，没过滤内容
* 由于会出现加解密乱码，故舍弃自定义进制加密法

用户名：0f4a@cf9bu5#6h&
密码：111
//加密通信用到的函数（在控制台输入）
function encrypt(str, pwd) {
    if(str == '') {
        return '';
    }
    str = encodeURIComponent(str);
    if(!pwd || pwd == '') {
        pwd = 'kb1234a';
    }
    pwd = encodeURIComponent(pwd);   
    if(pwd == '' || pwd.length <= 0) {
        return '';
    }
    var prand = '';
    for(var i = 0, len = pwd.length; i < len; i += 1) {
        prand += pwd.charCodeAt(i).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
               prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if(mult < 2) {
        return '';
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;   
    while(prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + 
                 parseInt(prand.substring(10, prand.length))).toString();
    } 
    prand = (mult * prand + incr) % modu;
    var encChr = '';
    var encStr = '';
    for(var i = 0, len = str.length; i < len; i += 1) {
        encChr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
        if(encChr < 16) {
            encStr += '0' + encChr.toString(16);
        }else{
            encStr += encChr.toString(16);
        }
        prand = (mult * prand + incr) % modu;
    }   
    salt = salt.toString(16);
    while(salt.length < 8) {
        salt = "0" + salt;
    }
    encStr += salt;
    return encStr;
}

function decrypt(str, pwd) {
    if(str == ''){
        return '';
    }
    if(!pwd || pwd == ''){
        pwd = 'kb1234a';
    }
    pwd = encodeURIComponent(pwd);
    if(str == undefined || str.length < 8) {
        return '';
    }
    if(pwd == undefined || pwd.length <= 0) {
        return '';
    }
    var prand = '';
    for(var i = 0, len = pwd.length; i < len; i += 1) {
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
    while(prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + 
                 parseInt(prand.substring(10, prand.length))).toString();   
    }
    prand = (mult * prand + incr) % modu;
    var encChr = '';
    var encStr = '';
    for(var i = 0, len = str.length; i < len; i += 2) {
        encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));   
        encStr += String.fromCharCode(encChr);   
        prand = (mult * prand + incr) % modu;   
    }
    return decodeURIComponent(encStr);
}

## 多人聊天室 （/roomchat） 未完成


## 上传 （/upload）

* 上传图片，完成后直接显示
* 上传文件，显示进度、速度，可中断

