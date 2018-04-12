function uploadByForm() {
    //用form 表单直接 构造formData 对象; 就不需要下面的append 方法来为表单进行赋值了。
    var formData = new FormData($("#uploadForm")[0]);
    $.ajax({
        url: "/upload",
        type: 'POST',
        data: formData,

        //必须false才会避开jQuery对 formdata 的默认处理,XMLHttpRequest会对 formdata 进行正确的处理
        processData: false,
        //必须false才会自动加上正确的Content-Type
        contentType: false,
        success: function (data) {
            console.log(data);
            if (data.url != undefined) {
                $("#image").attr("src", data.url);
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function ajaxForm() {
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    var request = $('#progressForm').ajaxForm({
        beforeSerialize: function () {
            //alert("表单数据序列化前执行的操作！");
            //$("#txt2").val("java");//如：改变元素的值
        },
        beforeSubmit: function () {
            //alert("表单提交前的操作");
            var filesize = $("#progressFile")[0].files[0].size / 1024 / 1024;
            if (filesize > 2000) {
                alert("文件大小超过限制，最多2000M");
                return false;
            }
            //if($("#txt1").val()==""){return false;}//如：验证表单数据是否为空
        },
        beforeSend: function () {
            status.empty();
            var percentVal = '0%';
            bar.css("width", percentVal);
            //bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {//上传的过程
            //position 已上传了多少
            //total 总大小
            //已上传的百分数
            var percentVal = percentComplete + '%';
            bar.css("width", percentVal);
            //bar.width(percentVal);
            percent.html(percentVal);
            //console.log(percentVal, position, total);
        },
        success: function (data) {//成功
            var percentVal = '100%';
            bar.css("width", percentVal);
            //bar.width(percentVal)
            percent.html(percentVal);
            //alert(data);
        },
        error: function (err) {//失败
            alert("表单提交异常！" + err.msg);
        },
        complete: function (xhr) {//完成
            status.html(xhr.responseText);
        }
    });
}

function XMLHttpRequestProgress() {
    var xhr;
    var ot;
    var oloaded;

    UpladFile();

    //上传文件方法
    function UpladFile() {
        var fileObj = document.getElementById("progressFile").files[0]; // js 获取文件对象
        var url = "/upload/progress"; // 接收上传文件的后台地址 
        var name = document.getElementById("progressFile").getAttribute("name");

        var form = new FormData(); // FormData 对象
        form.append(name, fileObj); // 文件对象
        //只有上传文件才需要中断，表单太快，中断没意义
        //formData.append(name, value);
        //formData.append(name, value, filename);
        //formData.append('username', 'Chris');
        //formData.append('userpic', myFileInput.files[0], 'chris.jpg');
        //formData.append('userpic[]', myFileInput.files[1], 'chris2.jpg');

        xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.onload = uploadComplete; //请求完成
        xhr.onerror = uploadFailed; //请求失败
        xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
        xhr.upload.onloadstart = function () {//上传开始执行方法
            ot = new Date().getTime();   //设置上传开始时间
            oloaded = 0;//设置上传开始时，以上传的文件大小为0
        };
        xhr.send(form); //开始上传，发送form数据
    }
    //上传进度实现方法，上传过程中会频繁调用该方法
    function progressFunction(evt) {

        var toBreak = document.getElementById("breakFile").value;
        if (toBreak == 1) {
            xhr.abort();
            alert("提交中断");
            document.getElementById("breakFile").value = 0;
            return false;
        }

        var progressBar = document.getElementsByClassName("bar")[0];
        var percentageDiv = document.getElementsByClassName("percent")[0];
        // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
        if (evt.lengthComputable) {//
            progressBar.max = evt.total;
            progressBar.value = evt.loaded;
            var percentVal = Math.round(evt.loaded / evt.total * 100) + "%";
            percentageDiv.innerHTML = percentVal;
            progressBar.style.width = percentVal;
        }

        var time = document.getElementById("time");
        var nt = new Date().getTime();//获取当前时间
        var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
        ot = new Date().getTime(); //重新赋值时间，用于下次计算

        var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b       
        oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算

        //上传速度计算
        var speed = perload / pertime;//单位b/s
        var bspeed = speed;
        var units = 'b/s';//单位名称
        if (speed / 1024 > 1) {
            speed = speed / 1024;
            units = 'k/s';
        }
        if (speed / 1024 > 1) {
            speed = speed / 1024;
            units = 'M/s';
        }
        speed = speed.toFixed(1);
        //剩余时间
        var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
        time.innerHTML = '速度：' + speed + units + '，剩余时间：' + resttime + 's';
        if (bspeed == 0)
            time.innerHTML = '上传已取消';
    }
    //上传成功响应
    function uploadComplete(evt) {
        //服务断接收完文件返回的结果
        //    alert(evt.target.responseText);
        alert("上传成功！");
    }
    //上传失败
    function uploadFailed(evt) {
        alert("上传失败！");
    }
    //取消上传
    function cancleUploadFile() {
        xhr.abort();
    }
}

$(function () {
    //ajaxForm();
    $('#break').on('click', function () {
        $('#breakFile').val(1);
    });
});