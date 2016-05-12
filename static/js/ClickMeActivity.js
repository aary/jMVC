function ClickMeActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
}
ClickMeActivity.prototype = new Activity();
ClickMeActivity.prototype.constructor = ClickMeActivity;

