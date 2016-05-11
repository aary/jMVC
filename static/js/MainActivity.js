function MainActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
    this.button_finish = {};
}
MainActivity.prototype = new Activity();

MainActivity.prototype.activity_will_boot = function() {
    console.log("MainActivity.activity_will_boot()");
};

MainActivity.prototype.activity_will_render = function() {
    console.log("MainActivity.activity_will_render()");
};

MainActivity.prototype.render = function() {
    console.log("MainActivity.render()");
    return `
        <Activity controller='ClickMeActivity'>
        </Activity>
    `
};

MainActivity.activity_did_render = function() {
    console.log("MainActivity.activity_did_render()");
};

MainActivity.activity_did_boot = function() {
    console.log("MainActivity.activity_did_boot()");
};

