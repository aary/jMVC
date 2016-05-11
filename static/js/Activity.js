/**
 * \file Activity.js
 * \author Aaryaman Sagar (rmn100@gmail.com)
 * \brief The Activity controller module
 *
 * This module contains the code for an activity.  An Activity is modeled off
 * of the Android activity class.  An activity is the current state of the app
 * on the browser screen.  Only one activity is to stay on screen at a time
 *
 *
 *      Lifecycle methods 
 *
 * These are called at times specified by the library to initialize and load
 * an activity.
 *
 * The three cases when these functions are called are 
 *  
 *  1. When the library loads.
 *      activity_will_boot();
 *      activity_will_render();
 *      render();
 *      activity_did_render();
 *      activity_did_boot();
 *
 *  2. When the user calls set_context()
 *      activity_will_render();
 *      render();
 *      activity_did_render();
 *
 *  3. When the activity goes out of sight
 *      activity_will_disappear();
 */

/*
 * \class Activity
 * \brief The main view controller class for this library
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
    this.child_activities_without_path = [];
    this.child_activities_with_path = [];

    // contains the text that was rendered by this activity at first, the text
    // is replaced only when the render function returns something different,
    // at which point the usual bootstrapping methods are called.
    this.current_render = undefined;
}

/**
 * \brief This function is called right before the activity is brought into
 *        existance.  This function is called only once in the lifecycle of the
 *        application.
 */
Activity.prototype.activity_will_boot = function() {};

/**
 * \brief This function is called right before the activity is going to render
 */
Activity.prototype.activity_will_render = function() {};

/** 
 * \brief Returns a string consisting of the html that is to be embedded into
 *        the activity.
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
 * \brief Called once and only once when the activity has finished booting.  
 *        This is called after the activity_did_render method.
 */
Activity.prototype.activity_did_boot = function() {};

/**
 * \brief Called right when the activity goes out of sight of the user window.
 *
 * Either when a transition is made to another activity, the user scrolls or
 * when a tab is switched in the browser.  The library hooks into the browser
 * using the browser's API and calls this method in the hook
 */
Activity.prototype.activity_will_disappear = function() {};

/**
 * \brief Called by the bootloader when the application loads in the browser
 *
 * This sets up the DOM, if the render() method has been overloaded to provide
 * a UI.  This also implies that this function is recursive in nature and
 * traverses the DOM dynamically to initialize all the activities
 */
Activity.prototype.boot = function() {
    
    // call the activity_will_boot method
    this.activity_will_boot();

    // render the activity into the dom, after this the activities should be
    // set in the DOM, this activity should then track the children that need
    // to render when this activity shows by default.  i.e. all the activities
    // with no path.  The show_impl() method will be called by the
    // infrastructure when the library needs to show a route.  In that case
    // all the activities without a path and that one activity with an id
    // should show
    this.render_impl();

    // Now call the activity_did_boot, each child has already booted and as a
    // result has already called activity_did_boot()
    this.activity_did_boot();

    // show the activity, only for testing
    this.show_views();
};

/**
 * \brief calls the activity.render method to inject the content into the DOM
 */
Activity.prototype.render_impl = function() {
    assert(this.id !== undefined);

    // call the activity_will_render function
    this.activity_will_render();

    // add in a child element containing the things that are rendered
    if (this.current_render === undefined) {
        $("#" + this.id).prepend(`
            <jmvc-placeholder id='activityrender${this.id}'>
            </jmvc-placeholder>
        `);
    }

    // if the current render is not the same as the initial render then
    // that render is replaced with the new one, maybe I will add in a
    // virtual DOM later on, though it should be easy, since the initial
    // render does not have ids, all that is needed is to output the diff of
    // the initial render and the current render, but I am lazy so TODO but
    // please do actually do it
    var new_render = this.render();
    if (new_render != this.current_render) {
        this.validate_render(new_render);
        this.current_render = new_render;
        $(`#activityrender${this.id}`).html(this.current_render);
    }

    // call the bootstrapping method to init activities that may have just
    // been rendered that have not already been initialized
    jmvc.bootloader.init_activities();

    // track the children and then call the boot function for each of the
    // children.  DFS FTW
    this.register_children();
    this.boot_children();

    // call activity_did_render
    this.activity_did_render();
};

/**
 * \brief Shows the views for the activity on the screen.  Edit config options
 *        to make the activity fade into sight
 */
Activity.prototype.show_views = function() {
    $("#" + this.id).fadeIn(jmvc.CONFIG.FADE_MS);
};

/**
 * \brief Walks through the DOM and registers all children
 *        that were there in static HTML or that were created on the render
 *        method. 
 *
 * This method uses jQuery to find all the children Activity elements and then
 * constructs the appropriate activities for them based on their 'controller'
 * attribute.  If there is an error in the HTML this throws an exception that
 * is caught by the bootloader which then quits.
 */
Activity.prototype.register_children = function() {
    
    // get the jQuery collection of children activities that are activities
    // and are only one level deep
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

    // store the arrays that should be shown when this one is shown, i.e. ones
    // without a route.  Only one of the activities that are children of this
    // activity will be shown since the route can only be one thing at a time
    this.child_activities_without_path = $("Activity:not([path])");
    this.child_activities_with_path = $("Activity[path]");
};

/* Helper method to validate the template rendered by the user */
Activity.prototype.validate_render = function(new_render) {
    assert(new_render.indexOf("path") === -1, 
            "Cannot add a route to the DOM dynamically");
};

/* Helper method that boots all the children activities one by one and sets
 * them to initialized */
Activity.prototype.boot_children = function() {

    $.each(this.child_activities, function(index, child_activity) {

        // the EECS 281 in me does not want to do this, it wants to keep a
        // separate list for better performance but whatevs
        if (!child_activity.initialized) {
            child_activity.object.boot();
            child_activity.initialized = true;
        }
    });
};
