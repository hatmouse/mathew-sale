/**
 *
 * Created by Home on 2015/3/23.
 */
//function tomysetting() {
//    $.getJSON("/mysetting", function (data) {
//        if (data.resultcode == 0) {
//            window.location.href = '/login'
//        }
//        else {
//            $.each(data.mysales, function (i, item) {
//                listmysales(item.sale_id,item.sale_name);
//            });
//            bind_del();
//            $('.salelist').css('display', 'none');
//            $('.setting').css('display', 'block');
//        }
//   });
//}
//function bind_del(){
//    $('.onesale .delsale').bind('click',function(){
//        var sale_id=$(this).parent().attr('sale_id');
//        alert(sale_id);
//        $.post('/mysetting',{
//            'opcode':'del',
//            'sale_id':sale_id
//        },function(data){
//            if(data.resultcode=='success'){
//                alert('删除成功');
//                $(this).parent().css('display','none');
//            }
//        })
//    })
//}
//function listmysales(sale_id,sale_name){
//    var x = "<div class='onesale' sale_id='"+sale_id+"'> \
//        <span class='name'>"+sale_name+"</span> \
//        <span class='delsale'>删除</span> \
//        </div>";
//    $('.mysales').append(x)
//}
//function tohome() {
//    $('.salelist').css('display', 'block');
//    $('.setting').css('display', 'none');
//}
//$('.mysetting').bind('click', function () {
//    tomysetting();
//    $.getJSON('/qiniu', function (resq) {
//        var authToken = resq.token;
//        var bucketName = 'winter1ife';
//        console.log(authToken);
//        uploadimg = $('#fileupload').fileupload({
//            url: 'http://upload.qiniu.com',
//            type: 'POST',
//            autoUpload: false,
//            fileObjName: 'file',
//            add: function (e, data) {
//                //$('.submitsale').click(function(){
//                //    data.submit();
//                //})
//                uploaddata = data;
//            },
//            progressall: function (e, data) {
//                var progress = parseInt(data.loaded / data.total * 100, 10);
//                $('#progress .progress-bar').css(
//                    'width', progress + '%'
//                );
//            },
//            done: function (e, data) {
//                //$('<p/>').text(data.result.key).appendTo('#files');
//                $('.successtip').css('display', 'inline');
//                ajaxuploadsale();
//            },
//            change: function (e, data) {
//                $.each(data.files, function (index, file) {
//                    console.log(file.name);
//                    uploadfilename = file.name;
//                    $('<p/>').text(file.name).appendTo('#files');
//                });
//            },
//            success: function () {
//                $('<span class="alert alert-success"/>')
//                    .text('上传成功 ' +
//                    new Date())
//                    .appendTo('#fileupload');
//            }
//        });
//        $('#fileupload').bind('fileuploadsubmit', function (e, data) {
//            //data.formData=[{name: 'token', value: authToken}, {name:'key',value:uploadfilename}]
//            var lastname = uploadfilename.split('.');
//            img_name = get_img_name() + "." + lastname[lastname.length - 1];
//            data.formData = {'token': authToken, 'key': img_name};
//        });
//    })
//});
//设置页数显示

function set_page_number() {
    $('.page_previous').attr('href', './?p=' + (page_number - 1));
    $('.page_next').attr('href', './?p=' + (page_number + 1));
    $('.page_number').text(page_number);
}
//获取到Json后再组合成html后添加
function getsales() {
    $.getJSON("/salelistjson?p=" + page_number, function (data) {
        if(data.length<10){
            $('.page_next a').attr('href','###');
            $('.page_next').addClass('disabled');
        }
        $.each(data, function (i, item) {
            addone(item.sale_id, item.nickname,item.sex, item.sale_name, item.sale_price, item.sale_newold, item.sale_desc, item.sale_contact, item.sale_img);
        });
        set_page_number();
        bind_pop_sale();
    })
}

//获取到Json后再组合成html后添加
function addone(sale_id, nickname, sex,sale_name, sale_price, sale_newold, sale_desc, contact, sale_img) {
    sale_img = 'http://winter1ife.qiniudn.com/' + sale_img+'?imageView2/0/w/120/h/120';
    var sexy='info_w';
    if(sex==1){
        sexy='info_m';
    }
    var x = "<div class='view' sale_id='" + sale_id + "'>\
    <div class='item_img'>\
        <img src='" + sale_img + "'/>\
        <span class='price'>" + sale_price + "</span>\
    </div>\
    <div class='info "+sexy+"'>\
        <div class='name'>" + sale_name + "</div>\
        <div class='detial'>\
            <span class='badge d_price'>" + sale_price + "RMB</span>\
            <span class='badge d_newold'>" + sale_newold + "成新</span>\
        </div>\
        <div class='username'>" + nickname + "</div>\
        <div class='contact'>" + contact + "</div>\
        <div class='abstract'>" + sale_desc + "</div>\
        <div class='readmore'>More</div>\
    </div>\
</div>";
    $('#grid').append(x);
}

function bind_pop_sale() {
    $('.item_img').unbind('click');
    $('.info').unbind('click');
    $('.item_img').bind('click', function () {
        var info = $(this).next();
        var username = info.find('.username').text();
        var sale_name = info.find('.name').text();
        var sale_price = info.find('.d_price').text();
        var sale_newold = info.find('.d_newold').text();
        var sale_contact = info.find('.contact').text();
        var sale_desc = info.find('.abstract').text();
        $('.pop_name').text(sale_name);
        $('.pop_username .c').text(username);
        $('.pop_price .c').text(sale_price);
        $('.pop_desc .c').text(sale_desc);
        $('.pop_newold .c').text(sale_newold);
        $('.pop_contact .c').text(sale_contact);
        $('.popmask').addClass('is-visible');
    });
    $('.info').bind('click', function () {
        var url = '/detail?id=' + $(this).parent().attr('sale_id');
        window.open(url, '_blank');
    })
}

$('.popmask').bind('click', function (event) {
    if ($(event.target).is('.pop_header .pop_close') || $(event.target).is('.popmask')) {
        event.preventDefault();
        $(this).removeClass('is-visible');
    }
});




//function ajaxuploadsale() {
//    var name = $('#input_name').val();
//    var price = $('#input_price').val();
//    var desc = $('#input_desc').val();
//    var contact = $('#input_contact').val();
//    var newold = $('#input_newold').val();
//    $.post('/addsale', {
//        sale_name: name,
//        sale_price: price,
//        sale_desc: desc,
//        sale_contact: contact,
//        sale_newold: newold,
//        img_name: img_name
//    }, function (data) {
//        if (data.resultcode == 'success') {
//            console.log(data);
//            alert('添加成功');
//        } else {
//            alert('未知错误');
//        }
//    }, "json")
//}
//function checkinput() {
//    if ($('#input_name').val() == '') {
//        $('.uploadalert span').text('请填写名称');
//        return false;
//    }
//    if ($('#input_price').val() == '') {
//        $('.uploadalert span').text('请填写价格');
//        return false;
//    }
//    if ($('#input_contact').val() == '') {
//        $('.uploadalert span').text('请填写联系方式');
//        return false;
//    }
//    if ($('#input_desc').val() == '') {
//        $('.uploadalert span').text('请填写描述');
//        return false;
//    }
//    if (uploadfilename == '') {
//        $('.uploadalert span').text('请选择照片');
//        return false;
//    }
//    if ($('#input_newold').val() == '') {
//        $('.uploadalert span').text('请填写新旧程度');
//        return false;
//    }
//    if (!parseInt($('#input_newold').val())) {
//        $('.uploadalert span').text('新旧请正确填写（1～100）');
//        return false;
//    }
//    if (!parseInt($('#input_price').val())) {
//        $('.uploadalert span').text('价格请正确填写');
//        return false;
//    }
//    return true;
//}
//$('.submitsale').bind('click', function (event) {
//    if (checkinput()) {
//        uploaddata.submit();
//    } else {
//        $('.uploadalert').css('display', 'block');
//    }
//    return false;
//});
//function get_img_name() {
//    var mydata = new Date();
//    var img_name = "" + username + mydata.getFullYear() + (mydata.getMonth() + 1) + mydata.getDate() + mydata.getHours() + mydata.getMinutes();
//    return img_name
//}
