$(document).ready(function(){

    $('form').attr('action','/userHome')
    $('form').attr('method', 'post')

    $('#loginButton').click(function(){
        $('form').submit()
    })
})  