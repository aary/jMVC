function JmvcActivity(id_in) {
    // call the constructor for the base class
    Activity.call(this, id_in);
};
JmvcActivity.prototype = new Activity();
JmvcActivity.prototype.constructor = JmvcActivity;
