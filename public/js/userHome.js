$(document).ready(function(){

    //a log out button must be included into the dom of the userHome page
    var logoutRoute='/logout'
    var element='<li><a href="'+ logoutRoute + '"> Logout </a></li>'
    $('#navButtonList').append(element)

    $('#go').click(function(){
        $('form').submit()

        Materialize.toast('Successfully updated!', 4000)//just a toast informing the user
    })

    //socket configuration

    // var socketRoute=window.location.hostname+':'+window.location.port
    var socket=io.connect()

    /*socket.on('hi', function(data){
        alert("data:"+data.data)
    })*/

    socket.on('newLogData', function(data){

        var characterName=data.data.characterName
        var toastVal='New notification for your subscribed character '+characterName

        Materialize.toast(toastVal, 2000)

        if($('#noNotification').length){
            $('#noNotification').remove()
        }
        data=data.data
        var name='<p><strong>Character: </strong>'+data.characterName+'</p><br>'
        var location='<p><strong>Whereabouts: </strong>'+data.location+'</p><br>'
        var relationship='<p><strong>Relationships: </strong>'+data.relationships+'</p><br>'
        var job='<p><strong>Job: </strong>'+data.job+'</p><br>'
        var assignments='<p><strong>Assignments: </strong>'+data.assignment+'</p><br>'
        var body='<p>'+name+location+relationship+job+assignments+'</p>'
        var element='<div class="card deep-purple lighten-3"><div class="card-content"><span class="card-title"> Notification </span>'+
        body+'</div></div>'
        $('#notificationContainer').append(element)

    })

})