function FinishMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
FinishMeActivity.prototype = new Activity();

FinishMeActivity.prototype.activity_will_load = function() {
    console.log("FinishMeActivity.activity_will_load()");
};

FinishMeActivity.prototype.render = function() {
    console.log("FinishMeActivity.render()");
};
