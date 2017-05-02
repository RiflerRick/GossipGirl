$(document).ready(function(){

    $('#go').click(function(){
        var email=localStorage.getItem('email')
        var characterName=$('#charName').val()
        var location=$('#whereabouts').prop("checked")
        var relationships=$('#relationships').prop("checked")
        var job=$('#job').prop("checked")
        var assignments=$('#assignments').prop("checked")
        var route='/userSuccess'+'/'+ email +'/'+characterName +'/'+ location+'/'+relationships+'/'+job+'/'+assignments
        window.location.assign(route)
    })
})