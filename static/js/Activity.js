/*
 *      Activity.js
 *
 * This module contains the code for an activity.  An Activity is modeled off
 * of the Android activity class.  An activity is the current state of the app
 * on the browser screen.  Only one activity is to stay on screen at a time.
 */

function Activity(id_in) {

    // Set the public ID for the current activity, this should correspond
    // exactly to the id tag of the div that contains the controller's
    // frontend in the html
    this.id = id_in;
    if (this.id) {
        assert($("#" + this.id).length, 
                "Id assigned to activity must exist");
    }

    // this is the context that the activity maintains.  This is linked to the
    // default handlebars template present in the activity if any.  Otherwise
    // it is ignored.  
    this.context = {};
}

/*
 *      Lifecycle methods 
 *
 * These are called at times specified by the library to initialize and load
 * an activity
 *
 * The three cases when these functions are called are 
 *  
 *  1. When the library loads.
 *      activity_will_load();
 *      render();
 *      activity_did_render();
 *
 *  2. When the user calls set_context()
 *      render();
 *      activity_did_render();
 *
 *  3. When the activity goes out of sight
 *      activity_will_disappear();
 */

/**
 * \brief activity_will_load This function is called right before the activity
 *        is brought into existance.  This function is called only once in the
 *        lifecycle of the application.
 */
Activity.prototype.activity_will_load = function() {};

/** 
 * \brief render Returns a string consisting of the html that is to be embedded
 *        into the activity.
 * \return returns the value that is going to be embedded into the activity.
 *         This can also return HTML with child activities.
 */
Activity.prototype.render = function() {};

/**
 * \brief activity_did_render Called right after the activity and all its child
 *        activities have been rendered on the screen.  
 */
Activity.prototype.activity_did_render = function() {};

/**
 * \brief activity_will_update Called right after the user calls the set_context
 *        method to set the context used by the templates
 */
Activity.prototype.activity_will_update = function() {};

/**
 * \brief activity_did_update Called right after the activity has updated on
 *        the screen.
 */
Activity.prototype.activity_did_update = function() {};

/**
 * \brief activity_will_disappear Called right when the activity goes out of
 * sight of the user window.  
 *
 * Either when a transition is made to another activity, the user scrolls or
 * when a tab is switched in the browser.  The library hooks into the browser
 * using the browser's API and calls this method in the hook
 */
Activity.prototype.activity_will_disappear = function() {};

/*******************************************************************************
 *                              IMPLEMENTATIONS                                *
 ******************************************************************************/
Activity.prototype.boot = function() {
    
    // call the activity_will_load method
    this.activity_will_load();

    // render the activity into the dom
    this.render_impl();
};

/**
 * \brief render_impl calls the activity.render method to inject the content
 *        into the DOM
 */
Activity.prototype.render_impl = function() {
    assert(this.id !== undefined);
    console.log("Rendering impl"); 

    $("#" + this.id).prepend(this.render());
};

/**
 * \brief show_views Shows the views for the activity on the screen.  Edit
 * config options to make the activity fade into sight
 */
Activity.prototype.show_views = function() {
};
