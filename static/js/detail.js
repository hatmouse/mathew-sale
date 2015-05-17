/**
 *
 * Created by Home on 2015/3/29.
 */
parent_id=0;
$('.commentmask').bind('click',function(event){
    if( $(event.target).is('.popcomment .cancel') || $(event.target).is('.commentmask') ) {
		event.preventDefault();
		$(this).removeClass('is-visible');
	}
});
$('.comment>.submit').bind('click',function(){
    parent_id=$(this).attr('comment_id');
    $('.commentmask').addClass('is-visible');
});
$('.popcomment .submit').bind('click',function(){
    var content=$('.popcomment textarea').val();
    if(content==''){
        playtip('内容不能为空～');
        return false;
    }
    $.post('/comment',{
        parent_id:parent_id,
        content:content,
        sale_id:sale_id
    },function(data){
        if(data.resultcode='success'){
            $('.commentmask').removeClass('is-visible');
            playtip('回复成功,即将刷新～');
            setTimeout(function(){
                location.reload() ;
            },2000);
        }
    },"json")
});
$('.ask>.submit').bind('click',function(){
    var content=$('.ask textarea').val();
    if(content==''){
        playtip('内容不能为空～');
        return false;
    }
    $.post('/comment',{
        content:content,
        sale_id:sale_id
    },function(data){
        if(data.resultcode=='success'){
            playtip('评论成功,即将刷新～');
            setTimeout(function(){
                location.reload() ;
            },2000);
        }else if(data.resultcode=='notlog'){
            playtip('尚未登录,即将跳转到登录～');
            setTimeout(function(){
                window.location.href = '/login';
            },2000);
        }
    },"json")
});