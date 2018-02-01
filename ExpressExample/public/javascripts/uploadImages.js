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