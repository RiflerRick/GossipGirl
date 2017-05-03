$(document).ready(function(){
    var email=localStorage.getItem('gossipGirlEmail')
    var logoutRoute='/logout/'+email
    var element='<li><a href="'+ logoutRoute + '"> Logout </a></li>'
    $('#navButtonList').append(element)
})