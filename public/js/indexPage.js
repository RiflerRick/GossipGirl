$(document).ready(function(){
    $('#loginButton').click(function(){
        var email=$('#email').val()

        localStorage.setItem('gossipGirlEmail',email)

        alert('email now:'+email)
        var route='/userHome/'+email
        window.location.assign(route)
    })
})  