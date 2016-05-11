function FinishMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
FinishMeActivity.prototype = new Activity();

FinishMeActivity.prototype.activity_will_boot = function() {
    console.log("FinishMeActivity.activity_will_boot()");
};

FinishMeActivity.prototype.activity_will_render = function() {
    console.log("FinishMeActivity.activity_will_render()");
};

FinishMeActivity.prototype.render = function() {
    console.log("FinishMeActivity.render()");
};

FinishMeActivity.prototype.activity_did_render = function() {
    console.log("FinishMeActivity.activity_did_render()");
};

FinishMeActivity.prototype.activity_did_boot = function() {
    console.log("FinishMeActivity.activity_did_boot()");
};
