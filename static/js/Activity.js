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
        assert($("Activity[path='" + this.id + "']").length, 
                "Id assigned to activity must exist");
    }

    // this is the public state that the controller fetches from the hash link
    // in the url in the browser
    this.public_state = {};

    // This is the private state of the activity.  Store all data that is not
    // public here
    this.private_state = {};

    // Get a default ajax requester for this activity
    this.ajax_requester = new AjaxRequester();

    // set this activity in the window
    this.register_activity();
}

/*
 *      Lifecycle methods
 *
 * These are divided into three different groups of lifecycle methods as follows
 *      1. When the activity is first being created; when the document loads;
 *         these are called by the Bootloader
 *      2. When the activity is going to be routed to by the Router.  These
 *         are typically analogous to the iOS viewWillAppear, viewDidAppear
 *         targets
 *      3. When the activity changes state, when the user calls the
 *         set_private_state methods on the activity
 */

/* 
 * This should return the HTML for the page that should go within the script
 * tags for the activity.  Dynamic Activity updating is not supported as of
 * yet so this can not return HTML with the <Activity> tag.  That should be
 * encoded in HTML.  Handlebars should be used for dynamic behavior. 
 *
 * This is called by the library boot loader. 
 */
Activity.prototype.boot = function() { return "" };

/*
 * These are called when the activity is routed to by the Router class.  So
 * either when the url changes, the page is refreshed or when someone calls
 * the router.route_to() method that leads to this Activity.  
 *
 * Making a transition in the before_show stage is going to squash the current
 * activity from loading and reload the path from the not showed part onwards.
 * For example if this activity had the path /inbox/messages and we made a
 * router.transition("create") with the create activity being under inbox as
 * well.  The router would squash the event queue which previously would have
 * moved through the following stages
 *      [InboxActivity.before_show, InboxActivity.redraw, 
 *          InboxActivity.show, InboxActivity.after_show, 
 *          Messages.before_show, Messages.redraw, Messages.show,
 *          Messages.after_show] 
 *      ... All InboxActivity lifecycle methods get executed, router now has 
 *          [InboxActivity] in its active Activities section
 *      [Messages.before_show, Messages.redraw, Messages.show,
 *          Messages.after_show]
 *
 * Then if a transition was called the router would squash its queue and move
 * to the following
 *      [CreateActivity.before_show, CreateActivity.redraw,
 *          CreateActivity.show, CreateActivity.after_show]
 * Without calling the InboxActivity methods again since they had already been
 * called, since the activity is marked active.
 */
Activity.prototype.before_show = function(previous_path) { console.log("before_show"); };
Activity.prototype.redraw = function() { console.log("redraw"); };
Activity.prototype.show = function() {};
Activity.prototype.after_show = function() { console.log("after_show"); };

Activity.prototype.events_for_show = function() {
    var arr_events = [];
    arr_events.push(this.before_show.bind(this));
    arr_events.push(this.redraw.bind(this));
    arr_events.push(this.show.bind(this));
    arr_events.push(this.after_show.bind(this));
    arr_events.push(this.id);
    return arr_events;
};

Activity.prototype.before_hide = function() {};
Activity.prototype.hide = function() {};
Activity.prototype.after_hide = function() {};

Activity.prototype.events_for_hide = function() {
    var arr_events = [];
    arr_events.push(this.before_hide.bind(this));
    arr_events.push(this.hide.bind(this));
    arr_events.push(this.after_hide.bind(this));
    arr_events.push(this.id);
    return arr_events;
};

/* 
 * These are called when the user calls set_private_state() on the activity.
 * This is the first method in a trio of methods that are called for the
 * activity.  Returning a false on should_update will not update the activity.
 */
Activity.prototype.should_update = function() { return true; };
Activity.prototype.before_update = function() { return undefined; };
Activity.prototype.redraw = function() { console.log("redraw"); };
Activity.prototype.after_update = function() { return undefined; };

/*
 * Used to redraw the screen.  
 *
 * Usually all that would need to go here is a call to
 * redraw_handlebar_template_with_context() with the appropriate Handlebars
 * context.  For more information on how to use Handlebars consult Google.
 *
 * ** This is not called by the library, you are in charge of calling this.
 *    This function has been put here simply as a style guideline.  **
 */

/*
 * Used to link all the widgets on the screen to possible callbacks.  For
 * example if the redraw() function was used to place several buttons on the
 * screen then you would set up the callback for click events on the button
 * here
 *
 * ** This is not called by the library, you are in charge of calling this.
 *    This function has been put here simply as a style guideline.  **
 */
Activity.prototype.wire_up_widgets = function() {};

/*
 * Used to show the views on the screen, if called with a null parameter
 * or no parameter at all then this does not fade the views in.  Otherwise
 * the parameter should be the number of milliseconds the fading in of the
 * views should take.
 *
 * This should be the final thing that is called in the loading process for an
 * activity.  For example if you are loading data via AJAX calls, you would
 * wait for that data to be fetched and then you would render any templates
 * you may have with the redraw_handlebar_template_with_context() function.
 * After that this function should be called to show all of the views for the
 * activity on the screen.
 */
Activity.prototype.show_views = function() {
    
    // remove the preliminary status bar
    jmvc.router.remove_progress_bar();
    $("Activity[path='" + this.id + "']").fadeIn(jmvc.CONFIG.FADE_MS);
};

/*
 * A utility function that can be used to redraw the handlebar template
 * with the given id and put the resulting html in the given placeholder
 * with the given context
 */
Activity.prototype.redraw_handlebar_template_with_context = function(template,
        placeholder, context) {

    // execute the 4 necessary steps
    var the_template_script = $(template).html(); 
    var the_template = Handlebars.compile(the_template_script);
    var compiled_html = the_template(context);
    $(placeholder).html(compiled_html);
};

/**************************************************************************
 * PRIVATES
/*************************************************************************/
/* Use this to hide the activity from sight */
Activity.prototype.hide = function(milli_seconds_to_fade_out) {

    // Hide views from screen
    if (typeof milli_seconds_to_fade_out === 'undefined') {
        $("Activity[path='" + this.id + "']").hide();
    } else {
        $("Activity[path='" + this.id + "']").fadeOut(milli_seconds_to_fade_out);
    }
};

/*
 * Use this function to show the views for this activity on the screen,
 * the private_state_in parameter can be used to pass in data to this
 * activity.
 */
Activity.prototype.show = function() {
    
    // get the public state from the browser and set back the state of the
    // browser to match the state of the activity.  This is done here even
    // after getting the state from the browser for the case when the
    // default public state is not even provided when the activity's show
    // function is called
    this.public_state = jmvc.router.get_public_activity_state();
    console.log(this.public_state);
    // jmvc.router.set_public_activity_state(this.public_state);

    // call the appropriate callback that the deriver can change to suit
    // his AJAX-ridden motives, if he returns a string they want to switch
    // to then switch and dont show the views for this screen
    // NEED TO CALL show_views() to show things
    this.show_views()
};

/**************************************************************************
 * PRIVATES
/*************************************************************************/
Activity.prototype.set_public_state = function(public_state_in) {
    this.public_state = public_state_in;
    jmvc.router.set_public_activity_state(this.public_state);
}

/* Links the activity to the window globally */
Activity.prototype.register_activity = function() {
    
    if (this.id !== undefined) {
        if (!("activities" in jmvc)) {
            jmvc.activities = {};
        }
        jmvc.activities[this.id] = this;
    }
}
