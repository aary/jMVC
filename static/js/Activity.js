/*
 * \file Activity.js
 * \author Aaryaman Sagar (rmn100@gmail.com)
 * \brief The Activity controller module
 *
 * This module contains the code for an activity.  An Activity is modeled off
 * of the Android activity class.  An activity is the current state of the app
 * on the browser screen.  Only one activity is to stay on screen at a time.
 *
 *
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

    // lists of child activities
    this.child_activities = [];

    // contains the text that was rendered by this activity at first, the text
    // is replaced only when the render function returns something different,
    // at which point the usual bootstrapping methods are called.
    this.current_render = undefined;
}

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
 * \brief activity_will_disappear Called right when the activity goes out of
 * sight of the user window.  
 *
 * Either when a transition is made to another activity, the user scrolls or
 * when a tab is switched in the browser.  The library hooks into the browser
 * using the browser's API and calls this method in the hook
 */
Activity.prototype.activity_will_disappear = function() {};

/**
 * \brief boot Called by the bootloader when the application loads in the
 *        browser
 *
 * This sets up the DOM, if the render() method has been overloaded to provide
 * a UI.  This also implies that this function is recursive in nature and
 * traverses the DOM dynamically to initialize all the activities
 */
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

    // add in a child element containing the things that are rendered
    if (this.current_render === undefined) {
        $("#" + this.id).prepend(`
            <div id='activityrender${this.id}'>
            </div>
        `);
    }

    // if the current render is not the same as the initial render then
    // that render is replaced with the new one, maybe I will add in a
    // virtual DOM later on, though it should be easy, since the initial
    // render does not have ids, all that is needed is to output the diff of
    // the initial render and the current render, but I am lazy so TODO but
    // please do actually do it
    var new_render = this.render();
    if (new_render != this.current_render || 
            this.current_render === undefined) {
        this.current_render = new_render;
        $(`#activityrender${this.id}`).html(this.current_render);
    }

    // call the bootstrapping method to init activities that may have just
    // been rendered
    jmvc.bootloader.init_activities();

    // track the children and then call the boot function for each of the
    // children.  DFS FTW
    this.register_children();
    $.each(this.child_activities, function(index, child_activity) {

        // the EECS 281 in me does not want to do this, it wants to keep a
        // separate list for better performance but whatevs
        if (!child_activity.initialized) {
            child_activity.object.boot();
            child_activity.initialized = true;
        }
    });
};

/**
 * \brief show_views Shows the views for the activity on the screen.  Edit
 * config options to make the activity fade into sight
 */
Activity.prototype.show_views = function() {
    $("#" + this.id).fadeIn(jmvc.CONFIG.FADE_MS);
};

/**
 * \brief register_children Walks through the DOM and registers all children
 *        that were there in static HTML or that were created on the render
 *        method. 
 *
 * This method uses jQuery to find all the children Activity elements and then
 * constructs the appropriate activities for them based on their 'controller'
 * attribute.  If there is an error in the HTML this throws an exception that
 * is caught by the bootloader which then quits.
 */
Activity.prototype.register_children = function() {
    
    // get the jQuery collection of children activities
    var activity_array = DomHelper.immediate_children($("#" + this.id), 
            "Activity");

    $.each(activity_array, function(index, value) {

        // get the controller type from them
        var id_child = $(value).attr("id");
        var controller_child = $(value).attr("controller");
        this.child_activities.push({
            "object" : new window[controller_child](id_child),
            "id" : id_child,
            "initialized" : false
        });;
    }.bind(this));
};
