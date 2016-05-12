function MainActivity(id_in) {

    // call the constructor for the base class
    Activity.call(this, id_in);

    // Objects that are going to get wired with callbacks soon
    this.button = {};
    this.button_finish = {};
}
MainActivity.prototype = new Activity();
MainActivity.prototype.constructor = MainActivity;

MainActivity.prototype.render = function() {
    console.log("MainActivity.render()");
    return `
        <Activity controller='ClickMeActivity'>
        </Activity>
    `
};
