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
 * Lifecycle methods
 *
 * These are called at times specified by the library to initialize and load
 * an activity.
 *
 * The three cases when these functions are called are
 *
 *  1. When the library loads.  Every activity does this.
 *      activity_will_boot();
 *      render();
 *      activity_did_boot();
 *
 *  2. When a routing occurs.  Do any AJAX calls in did_appear()
 *      activity_will_appear(); // when the view comes on screen
 *      activity_will_bind();
 *      activity_did_bind();
 *      activity_did_appear();
 *
 *  2. When the user calls set_context()
 *      activity_will_bind();
 *      activity_did_bind();
 *
 *  3. When the activity goes out of sight
 *      activity_will_disappear();
 */

/*jslint browser:true*/
/*global jmvc, assert, $, console*/

/*
 * \class Activity
 * \brief The main view controller class for this library
 */
function Activity(id_in) {

    // Set the public ID for the current activity, this should correspond
    // exactly to the id tag of the div that contains the controller's
    // frontend in the html
    this.id = id_in;
    if (this.id) { // 0 and undefined work here
        assert($("#" + this.id).length,
                "Id assigned to activity must exist");
    }

    // this is the context that the activity maintains.  This is linked to the
    // default handlebars template present in the activity if any.  Otherwise
    // it is ignored.
    this.context = {};

    // lists of child activities
    this.child_activities = [];
    // maps from id to activity object
    this.child_activities_without_path = {};
    this.child_activities_with_path = {};

    // contains the text that was rendered by this activity at first, the text
    // is replaced only when the render function returns something different,
    // at which point the usual bootstrapping methods are called.
    delete this.current_render;
}

/**
 * \fn
 * \brief This function is called right before the activity is brought into
 *        existance.  This function is called only once in the lifecycle of the
 *        application.
 */
Activity.prototype.activity_will_boot = function() {
    console.log(this.constructor.name + ".activity_will_boot()");
};

/**
 * \fn
 * \brief Returns a string consisting of the html that is to be embedded into
 *        the activity.
 * \return returns the value that is going to be embedded into the activity.
 *         This can also return HTML with child activities.
 */
Activity.prototype.render = function() {
    console.log(this.constructor.name + ".render()");
};

/**
 * \fn
 * \brief Called once and only once when the activity has finished booting.
 *        This is called after the activity_did_render method.
 */
Activity.prototype.activity_did_boot = function() {
    console.log(this.constructor.name + ".activity_did_boot()");
};

/**
 * \fn
 * \brief This function is called right before the activity is going to render
 */
Activity.prototype.activity_will_appear = function() {
    console.log(this.constructor.name + ".activity_will_appear()");
};

/**
 * \fn
 * \brief This function is called right before the activity is about to bind
 *        its context with the template
 */
Activity.prototype.activity_will_bind = function() {
    console.log(this.constructor.name + ".activity_will_bind()");
};

/**
 * \fn
 * \brief activity_did_render Called right after the activity and all its child
 *        activities have been rendered on the screen.
 */
Activity.prototype.activity_did_bind = function() {
    console.log(this.constructor.name + ".activity_did_bind()");
};

/**
 * \fn
 * \brief activity_did_render Called right after the activity and all its child
 *        activities have been rendered on the screen.
 */
Activity.prototype.activity_did_appear = function() {
    console.log(this.constructor.name + ".activity_did_appear()");
};

/**
 * \fn
 * \brief Called right when the activity goes out of sight of the user window.
 *
 * Either when a transition is made to another activity, the user scrolls or
 * when a tab is switched in the browser.  The library hooks into the browser
 * using the browser's API and calls this method in the hook
 */
Activity.prototype.activity_will_disappear = function() {
    console.log(this.constructor.name + ".activity_will_disappear()");
};

/**
 * \fn
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
    this.prepare_render(); // writes a prepend element to the DOM
    this.render_impl();

    // add this activity by id in the map from id to activity object
    jmvc.activities[this.id] = this;

    // Now call the activity_did_boot, each child has already booted and as a
    // result has already called activity_did_boot()
    this.activity_did_boot();

    // show the activity, only for testing
    // this.show();
};

/**
 * \fn
 * \brief calls the activity.render method to inject the content into the DOM
 */
Activity.prototype.render_impl = function() {
    assert(this.id !== undefined);

    // if the current render is not the same as the initial render then
    // that render is replaced with the new one, maybe I will add in a
    // virtual DOM later on, though it should be easy, since the initial
    // render does not have ids, all that is needed is to output the diff of
    // the initial render and the current render, but I am lazy so but
    // please do actually do it
    var new_render = this.render();
    if (new_render !== this.current_render) {
        this.assert_validate_render(new_render);
        this.current_render = new_render;
        $(`#activityplaceholder${this.id}`).html(this.current_render);
    }

    // call the bootstrapping method to init activities that may have just
    // been rendered that have not already been initialized
    jmvc.bootloader.init_activities();

    // track the children and then call the boot function for each of the
    // children.  DFS FTW
    this.register_children();
    this.boot_children();
    this.register_children_path();
};

/**
 * \fn
 * \brief Writes a placeholder div in which the activity elements will go
 */
Activity.prototype.prepare_render = function() {

    // add in a child element containing the things that are rendered
    $("#" + this.id).prepend(`
        <jmvc-placeholder id='activityplaceholder${this.id}'>
        </jmvc-placeholder>
    `);
};

/**
 * \fn
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
        });
    }.bind(this));

};

/**
 * \fn
 * \brief Helper method that boots all the children activities one by one and sets
 *        them to initialized
 */
Activity.prototype.boot_children = function() {

    $.each(this.child_activities, function(index, child_activity) {

        // I do not want to do this, keep a separate list for better
        // performance but whatevs
        assert("initialized" in child_activity);
        if (child_activity.initialized === false) {
            child_activity.object.boot();
            child_activity.initialized = true;
        }
    });
};

/**
 * \fn
 * \brief Used to register the children with path ids into a map after they
 *        have booted
 */
Activity.prototype.register_children_path = function() {

    // get the jQuery collection of children activities that are activities
    // and are only one level deep
    var activity_array = DomHelper.immediate_children($("#" + this.id),
            "Activity");

    // store the arrays that should be shown when this one is shown, i.e. ones
    // without a route.  Only one of the activities that are children of this
    // activity will be shown since the route can only be one thing at a time
    var child_activities_without_path_arr = $(activity_array)
        .filter("Activity:not([path])");
    var child_activities_with_path_arr = $(activity_array)
        .filter("Activity[path]");

    // make the function to help out and then call it
    var register_array_in_map = function(array_children, map_children) {

        $.each(array_children, function(index, value) {
            var jquery_value = $(value);
            assert(jquery_value.attr("id"));

            map_children[jquery_value.attr("id")] =
                jmvc.activities[jquery_value.attr("id")];
        });
    };
    register_array_in_map(child_activities_without_path_arr,
            this.child_activities_without_path);
    register_array_in_map(child_activities_with_path_arr,
            this.child_activities_with_path);
};

/**
 * \fn
 * \brief Shows the views for the activity on the screen.  Edit config options
 *        to make the activity fade into sight
 */
Activity.prototype.show = function(child_path) {

    // call activity_will_appear on the parent first
    this.activity_will_appear();

    // show children views first, depth first, doesnt matter if these
    // activites are shown because they will not be shown until this one is
    $.each(this.child_activities_without_path, function(key, value) {
        value.show();
    });

    console.log("path passed in to activity id " + this.id + " to show is ", 
            child_path);

    // check if child_path isnt undefined becasue this method is called above
    // without an argument for all children that do not have a path attribute
    if (child_path) {
        if (child_path.length) {
            var activity_to_show_with_path = child_path[0];
            child_path.shift();

            // assert that the activity id passed in does exist, assert and
            // dont throw an exception because only the router calls this
            // method.
            assert(activity_to_show_with_path 
                    in this.child_activities_with_path);
            this.child_activities_with_path[activity_to_show_with_path]
                .show(child_path);
        }
    }

    $("#" + this.id).fadeIn(jmvc.CONFIG.FADE_MS);
};

/**
 * \fn
 * \brief Helper method to validate the template rendered by the user
 */
Activity.prototype.assert_validate_render = function(new_render) {
    assert(new_render.indexOf("path") === -1,
            "Cannot add a route to the DOM dynamically");
};
