$(document).ready(function() {
    $('#index_view_cheat_controller').css('display', 'none');
    $('#index_view_question_controller').css('display', 'none');

    // console.log(JSON.parse(window.location.hash.split('#view_question/')[1].trim()));
    // Set route bindings
    router = new Router(window.location.hash);
    router.setRoutes({
        'view_question' : function(url_data) {
            activity = new QuestionActivity('index_view_question_controller',
                'view_question',
                url_data);
            activity.show(1000);
        },
        '__default' : function(url_data) {
            activity = new Activity('index_view_question_controller', 'view_question',
                url_data);
            activity.show(1000);
        }
    });

    // route to the appropriate activity instance
    router.routeToActivity();

});

