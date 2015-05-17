/**
 *
 * Created by Home on 2015/3/31.
 */
function playtip(content){
    $('.mytip span').text(content);
    $('.mytip').show();
    setTimeout(function(){
        $('.mytip').hide();
    },3000);
}
