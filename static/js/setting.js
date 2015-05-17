/**
 * Created by Home on 2015/3/30.
 */
uploaddata = '';
uploadfilename = '';
img_name = '';
function bind_del(){
    $('.onesale .delsale').bind('click',function(){
        var sale_id=$(this).parent().attr('sale_id');
        var sale_deled=$(this).parent();
        $.post('/mysetting',{
            'opcode':'del',
            'sale_id':sale_id
        },function(data){
            if(data.resultcode=='success'){
                sale_deled.css('display','none');
            }
        },"json")
    })
}
function Init_Upload() {
    $.getJSON('/qiniu', function (resq) {
        var authToken = resq.token;
        var bucketName = 'winter1ife';
        console.log(authToken);
        uploadimg = $('#fileupload').fileupload({
            url: 'http://upload.qiniu.com',
            type: 'POST',
            autoUpload: false,
            fileObjName: 'file',
            add: function (e, data) {
                //$('.submitsale').click(function(){
                //    data.submit();
                //})
                uploaddata = data;
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width', progress + '%'
                );
            },
            done: function (e, data) {
                //$('<p/>').text(data.result.key).appendTo('#files');
                $('.successtip').css('display', 'inline');
                ajaxuploadsale();
            },
            change: function (e, data) {
                $.each(data.files, function (index, file) {
                    console.log(file.name);
                    uploadfilename = file.name;
                    $('<p/>').text(file.name).appendTo('#files');
                });
            },
            success: function () {
                $('<span class="alert alert-success"/>')
                    .text('上传成功 ' +
                    new Date())
                    .appendTo('#fileupload');
            }
        });
        $('#fileupload').bind('fileuploadsubmit', function (e, data) {
            //data.formData=[{name: 'token', value: authToken}, {name:'key',value:uploadfilename}]
            var lastname = uploadfilename.split('.');
            img_name = 'sxusale/'+get_img_name() + "." + lastname[lastname.length - 1];
            data.formData = {'token': authToken, 'key': img_name};
        });
    })
};
function ajaxuploadsale() {
    var name = $('#input_name').val();
    var price = $('#input_price').val();
    var desc = $('#input_desc').val();
    var contact = $('#input_contact').val();
    var newold = $('#input_newold').val();
    $.post('/addsale', {
        sale_name: name,
        sale_price: price,
        sale_desc: desc,
        sale_contact: contact,
        sale_newold: newold,
        img_name: img_name
    }, function (data) {
        if (data.resultcode == 'success') {
            playtip('上传成功,即将刷新～');
            setTimeout(function(){
                location.reload() ;
            },2000);
        } else {
            alert('未知错误');
        }
    }, "json")
}
function checkinput() {
    if ($('#input_name').val() == '') {
        $('.uploadalert span').text('请填写名称');
        return false;
    }
    if ($('#input_price').val() == '') {
        $('.uploadalert span').text('请填写价格');
        return false;
    }
    if ($('#input_contact').val() == '') {
        $('.uploadalert span').text('请填写联系方式');
        return false;
    }
    if ($('#input_desc').val() == '') {
        $('.uploadalert span').text('请填写描述');
        return false;
    }
    if (uploadfilename == '') {
        $('.uploadalert span').text('请选择照片');
        return false;
    }
    if ($('#input_newold').val() == '') {
        $('.uploadalert span').text('请填写新旧程度');
        return false;
    }
    if (!parseInt($('#input_newold').val())) {
        $('.uploadalert span').text('新旧请正确填写（1～100）');
        return false;
    }
    if (!parseInt($('#input_price').val())) {
        $('.uploadalert span').text('价格请正确填写');
        return false;
    }
    return true;
}
$('.submitsale').bind('click', function (event) {
    if (checkinput()) {
        uploaddata.submit();
    } else {
        $('.uploadalert').css('display', 'block');
    }
    return false;
});
function get_img_name() {
    var mydata = new Date();
    var img_name = "" + username + mydata.getFullYear() + (mydata.getMonth() + 1) + mydata.getDate() + mydata.getHours() + mydata.getMinutes();
    return img_name
}

$('.panel-heading').bind('click',function(){
    var span=$(this).find('span');
    var next=$(this).next();
    if(next.css('display')=='none'){
        span.removeClass('glyphicon-plus');
        span.addClass('glyphicon-minus');
        next.show();
    }else{
        span.addClass('glyphicon-plus');
        span.removeClass('glyphicon-minus');
        next.hide();
    }
});

$('.logout').bind('click',function(){
    $.post('/mysetting',{
        'opcode':'logout'
    },function(data){
        if(data.resultcode=='success'){
            playtip('您已经退出, 请重新登录～')
            setTimeout(function(){
                location.reload() ;
            },2000);
        }
    },"json");
});