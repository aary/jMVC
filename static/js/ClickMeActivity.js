function ClickMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
ClickMeActivity.prototype = new Activity();

ClickMeActivity.prototype.after_show = function() {
    this.wire_up_widgets();
}

ClickMeActivity.prototype.wire_up_widgets = function() {
    this.button = $("#home_controller_button");

    this.button.click(function() {
        NProgress.configure({ showSpinner: true });
        NProgress.start();
        NProgress.inc(0.2);
    });
    $("#hide_click_button").click(function() {
        jmvc.router.switch_to("index");
    }.bind(this));
}
