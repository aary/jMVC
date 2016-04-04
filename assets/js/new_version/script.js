$(document).ready(function() {
    $('#home_controller').css('display', 'none');
    $('#select_car_controller').css('display', 'none');
    $('#game_progress_controller').css('display', 'none');

    router = new Router(window.location.hash)
    router.set_activities({
        'home_controller' : new Activity('home_controller'),
        'select_car_controller' : new Activity('select_car_controller'),
        'game_progress_controller' : new Activity('game_progress_controller')
    });
    router.set_default('select_car_controller');
    router.route_to_activity(1000);
});
