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
})