function JmvcActivity(id_in) {
    // call the constructor for the base class
    Activity.call(this, id_in);
};
JmvcActivity.prototype = new Activity();

JmvcActivity.prototype.activity_will_load = function() {
    console.log("JmvcActivity.activity_will_load()");
};

JmvcActivity.prototype.render = function() {
    console.log("JmvcActivity.render()");
};
