"use strict" 

function assert(condition, message) {
    if (!condition) {
        message = "Assertion failed : " + message;
        if (typeof Error !== "undefined") {
            alert(message);
            var error = new Error(message);
            console.log(error.stack);
            return;
        }
        alert(message);
        throw message; // Fallback
    }
}

$(document).ready(function() {

    $('#home_controller').css('display', 'none');

    var router = new Router(window.location.hash)
    router.set_public_activities({
        'home_controller' : new MainActivity('home_controller', router),
    });
    router.set_private_activities({});

    router.route_to_current_activity();
});
