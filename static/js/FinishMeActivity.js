function FinishMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
FinishMeActivity.prototype = new Activity();
FinishMeActivity.prototype.constructor = FinishMeActivity;
