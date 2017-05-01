$(document).ready(function(){
    $('#logButton').click(function(){
        var characterName=$('#characterName').text()
        var location=$('#location').text()
        var relationship=$('#relationship').text()
        var job=$('#job').text()
        var assignment=$('#assignment').text()
        var route='adminHome/'+email
        window.location.assign(route)
    })
})  