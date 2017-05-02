$(document).ready(function(){
    $('#loginButton').click(function(){
        var email=$('#email').val()

        localStorage.setItem('email',email)

        alert('email now:'+email)
        var route='userHome/'+email
        window.location.assign(route)
    })
})  