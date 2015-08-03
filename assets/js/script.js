$(document).ready(function() {
    $("#index_view_cheat_controller").css("display", "none");
    $('#index_view_question_controller').css('display', 'none');

    // console.log(JSON.parse(window.location.hash.split('#view_question/')[1].trim()));
    // Set route bindings
    router = new Router(window.location.hash);
    router.setRoutes({
        "view_question" : function(url_data) {
            fragment = new Fragment('index_view_question_controller', 'view_question',
                url_data);
            fragment.show(1000);
        },
        "__default" : function(url_data) {
            fragment = new Fragment('index_view_question_controller', 'view_question',
                url_data);
            fragment.show(1000);
        }
    });
    router.routeToFragment();

    //console.log("hash is " + window.location.hash);
    //console.log(window.location.hash.split('#')[1].split('/'));
    
    fragment = new Fragment('index_view_question_controller', 'view_question');
    fragment.show(1000);
});

