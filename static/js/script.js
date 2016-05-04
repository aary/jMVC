"use strict" 

$(document).ready(function() {

    $('#home_controller').css('display', 'none');

    var router = new Router(window.location.hash)
    router.set_public_activities({
        'home_controller' : new MainActivity('home_controller', router),
    });
    router.set_private_activities({});
    router.route_to_current_activity();
});
