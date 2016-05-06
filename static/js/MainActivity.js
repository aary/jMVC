function MainActivity(id_in, router_in) {

    // call the constructor for the base class 
    Activity.call(this, id_in, router_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
    this.button_finish = {};
}
MainActivity.prototype = new Activity();

MainActivity.prototype.on_show = function(optional_data) {
    this.actually_show();
}

MainActivity.prototype.wire_up_widgets = function() {
    this.button = $("#home_controller_button");
    this.button_finish = $("#home_controller_button_finish");

    this.button.click(function() {
        NProgress.configure({ showSpinner: true });
        NProgress.start();
        NProgress.inc(0.2);
    });
    this.button_finish.click(function() {
        NProgress.done(true);
    });
}
