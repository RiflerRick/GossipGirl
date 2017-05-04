$(document).ready(function(){
    $('#loginButton').click(function(){
        var email=$('#email').val()
        
        var route='/userHome/'+email
        window.location.assign(route)
    })
})  