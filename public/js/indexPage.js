$(document).ready(function(){
    $('#loginButton').click(function(){
        var email=$('#email').text()
        var route='userHome?email='+email
        window.location.assign(route)
    })
})  