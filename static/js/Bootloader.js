/**
 * \file Bootloader.js
 * \brief This file contains the initialization code for the library
 *
 * For example this contains the code to make all activities invisible to
 * start and to import all the needed library files into the html
 * Really wanted to call this Bootstrap.js but ...
 */

/* link the library to the window globally */
window.jmvc = {};

/* This class has all the boot methods */
function Bootloader() {};

$(document).ready(function() {
    jmvc.bootloader = new Bootloader();
    jmvc.bootloader.boot(); // to be explicit
});

/**
 * \brief Boot function.  This function initializes the library. 
 */
Bootloader.prototype.boot = function() {

    var time_begin = Date.now();

    // the router make it a singleton
    assert(!("router" in jmvc), "A router instance already exists");
    jmvc.router = new Router();

    // initialize a super activity that wraps around every other activity,
    // this is done for convenience in routing
    this.init_super_activity();

    // render basic activity state for all the activities out there, like the
    // unique id and hide them
    this.init_activities();

    // boot the main activity which boots its child activities, see Activity.js
    this.boot_super_activity();

    // initialize the router with the current super activity; which should be
    // safely tucked away in jmvc.super_activity by now.  And then route to
    // the appropriate activity
    jmvc.router.boot();
    jmvc.router.route_to_current_activity();

    var time_end = Date.now();
    console.log("Milliseconds taken to boot : ", time_end - time_begin);
};

/**
 * \brief This sets up the parent activity for all the other activities in the
 *        app.
 *
 * The benefit of having a super activity is that it makes this library code
 * DRY (don't repeat yourself).  This anonymous super activity then becomes
 * responsible for the lifecycle of all the activities on the page.
 */
Bootloader.prototype.init_super_activity = function() {
    $("body").wrapInner(`
        <Activity path="" controller="${jmvc.CONFIG.SUPER_ACTIVITY}">
        </Activity>
    `);

    // add the super activity to the list of activities
    if (jmvc.activities === undefined) {
        jmvc.activities = {};
    }
    jmvc.activities["0"] = new window[jmvc.CONFIG.SUPER_ACTIVITY](0);
};

/**
 * \brief This sets up the activities that have been entered into the HTML
 *        for the page at the moment.  Only operates on activities that do not
 *        have ids.  Them not having ids implies that they have not been 
 *        linked with their parent activities.
 */
Bootloader.prototype.init_activities = function() {

    var activities_without_ids = $("Activity:not([id])");
    this.hide_activities(activities_without_ids);
    this.set_unique_ids(activities_without_ids);
};

/**
 * \brief Calls the boot method on the super activity that then in turn calls
 *        the boot method on all children
 */
Bootloader.prototype.boot_super_activity = function() {
    jmvc.activities[0].boot();
};

/**
 * \brief Hides all the activities passed in
 * \param activities_without_ids The activities to hide
 */
Bootloader.prototype.hide_activities = function(activities_without_ids) {
    assert(activities_without_ids !== undefined);

    $.each(activities_without_ids, function(index, value) {
        assert($(value).attr("id") === undefined);
        $(value).css("display", "none");
    });
};

/**
 * \brief This sets up all the activities passed in with unique ids
 * \param activities_without_ids The activities to setup with ids
 */
Bootloader.prototype.set_unique_ids = function(activities_without_ids) {
    assert(activities_without_ids !== undefined);

    $.each(activities_without_ids, function(index, value) {
        assert($(value).attr("id") === undefined);
        $(value).attr("id", this.unique_id());
    }.bind(this));
};

/**
 * \brief Returns the next unique integer from the scope of the program
 * \bug This only goes up until the highest integer that the current
 *      JavaScript implementation can handle
 */
Bootloader.prototype.unique_id = function() {
    if (this.counter === undefined) {
        this.counter = 0;
    }
    return this.counter++;
};
