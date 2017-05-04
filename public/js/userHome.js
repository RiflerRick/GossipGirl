$(document).ready(function(){

    //a log out button must be included into the dom of the userHome page
    var logoutRoute='/logout'
    var element='<li><a href="'+ logoutRoute + '"> Logout </a></li>'
    $('#navButtonList').append(element)

    $('#go').click(function(){
        var characterName=$('#charName').val()
        var location=$('#whereabouts').prop("checked")
        var relationships=$('#relationships').prop("checked")
        var job=$('#job').prop("checked")
        var assignments=$('#assignments').prop("checked")
        var route='/userSuccess'+'/'+characterName +'/'+ location+'/'+relationships+'/'+job+'/'+assignments
        window.location.assign(route)
    })

    //socket configuration

    var socketRoute=window.location.hostname+':'+window.location.port
    var socket=io.connect(socketRoute)/*
    socket.on('hey', function(data){
        alert('hey')
    })*/
    socket.on('newDataLog', function(data){
        alert('data now:'+data.data)
        if($('#noNotification')){
            $('noNotification').remove()
        }
        var name='<p><strong>Character:</strong>'+data.characterName+'</p><br>'
        var location='<p><strong>Whereabouts</strong>'+data.location+'</p><br>'
        var relationship='<p><strong>Relationships</strong>'+data.relationships+'</p><br>'
        var job='<p><strong>Job</strong>'+data.job+'</p><br>'
        var assignments='<p><strong>Assignments</strong>'+data.assignment+'</p><br>'
        var body='<p>'+name+location+relationship+job+assignments+'</p>'
        var element='<div class="card"><div class="card-content"><span class="card-title"> Notification </span>'+
        body+'</div></div>'
        $('#notificationContainer').append(element)

    })

})