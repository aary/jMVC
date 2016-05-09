function FinishMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
FinishMeActivity.prototype = new Activity();

FinishMeActivity.prototype.after_show = function() {
    this.wire_up_widgets();
}

FinishMeActivity.prototype.wire_up_widgets = function() {
    this.button = $("#home_controller_button_finish");

    this.button.click(function() {
        NProgress.done(true);
    });
}
