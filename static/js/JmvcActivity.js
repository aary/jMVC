function JmvcActivity(id_in) {
    // call the constructor for the base class
    Activity.call(this, id_in);
};
JmvcActivity.prototype = new Activity();

JmvcActivity.prototype.activity_will_boot = function() {
    console.log("JmvcActivity.activity_will_boot()");
};

JmvcActivity.prototype.activity_will_render = function() {
    console.log("JmvcActivity.activity_will_render()");
};

JmvcActivity.prototype.render = function() {
    console.log("JmvcActivity.render()");
};

JmvcActivity.prototype.activity_did_render = function() {
    console.log("JmvcActivity.activity_did_render()");
};

JmvcActivity.prototype.activity_did_boot = function() {
    console.log("JmvcActivity.activity_did_boot()");
};
