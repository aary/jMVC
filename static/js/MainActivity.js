function MainActivity(id_in, router_in) {

    Activity.call(this, id_in, router_in);

    this.button = {};
    this.button_finish = {};
}
MainActivity.prototype = new Activity();

MainActivity.prototype.on_show = function(optional_data) {
    this.redraw();
    this.wire_up_widgets();
    this.show_views();
}

MainActivity.prototype.wire_up_widgets = function() {
    this.button = $("#home_controller_button");
    this.button_finish = $("#home_controller_button_finish");

    this.button.click(function() {
        alert("Clicked button");
        NProgress.configure({ showSpinner: true });
        NProgress.start();
        NProgress.inc(0.2);
    });
    this.button_finish.click(function() {
        NProgress.done(true);
    });
}
