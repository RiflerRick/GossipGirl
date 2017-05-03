$(document).ready(function(){

    $('form').attr('action','/adminSuccess')
    $('form').attr('method','post')

    $('#logButton').click(function(){/*
        var characterName=$('#characterName').val()
        var location=$('#location').val()
        var relationship=$('#relationship').val()
        var job=$('#job').val()
        var assignment=$('#assignment').val()
        var route='adminSuccess/'+characterName+'/'+location+'/'+relationship+'/'+job+'/'+assignment
        window.location.assign(route)*/
        $('form').submit()

    })

})  