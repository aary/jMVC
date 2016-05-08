function ClickMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
ClickMeActivity.prototype = new Activity();

ClickMeActivity.prototype.on_show = function(optional_data) {
    this.actually_show();
}

ClickMeActivity.prototype.wire_up_widgets = function() {
    this.button = $("#home_controller_button");

    this.button.click(function() {
        NProgress.configure({ showSpinner: true });
        NProgress.start();
        NProgress.inc(0.2);
    });
}
