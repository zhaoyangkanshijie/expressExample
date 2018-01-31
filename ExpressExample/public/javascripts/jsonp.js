$(function () {
    function getMessage(jsonp) {
        alert("message:" + jsonp);
    }
    $.ajax({
        url: "#",
        type: "get",
        dataType: "jsonp",
        jsonp: "callback", //这里定义了callback的参数名称，以便服务获取callback的函数名即getMessage  
        jsonpCallback: "getMessage", //这里定义了jsonp的回调函数  
        success: function (data) {
            alert("success:" + data);
        },
        error: function () {
            alert("发生异常");
        }
    });  
})