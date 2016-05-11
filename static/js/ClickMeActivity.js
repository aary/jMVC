function ClickMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
ClickMeActivity.prototype = new Activity();

ClickMeActivity.prototype.activity_will_boot = function() {
    console.log("ClickMeActivity.activity_will_boot()");
};

ClickMeActivity.prototype.activity_will_render = function() {
    console.log("ClickMeActivity.activity_will_render()");
};

ClickMeActivity.prototype.render = function() {
    console.log("ClickMeActivity.render");
};

ClickMeActivity.prototype.activity_did_render = function() {
    console.log("ClickMeActivity.activity_did_render()");
};

ClickMeActivity.prototype.activity_did_boot = function() {
    console.log("ClickMeActivity.activity_did_boot()");
};

