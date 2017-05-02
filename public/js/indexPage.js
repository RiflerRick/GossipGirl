$(document).ready(function(){
    $('#loginButton').click(function(){
        var email=$('#email').val()
        alert('email now:'+email)
        var route='userHome/'+email
        window.location.assign(route)
    })
})  