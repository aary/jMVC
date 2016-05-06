/*
 *      Activity.js
 *
 * This module contains the code for an activity.  An Activity is modeled off
 * of the Android activity class.  An activity is the current state of the app
 * on the browser screen.  Only one activity is to stay on screen at a time.
 */

FADE_MS = 500;

function Activity(id_in, router_in) {

    // Set the public ID for the current activity, this should correspond
    // exactly to the id tag of the div that contains the controller's
    // frontend in the html
    this.id = id_in;
    if (this.id) {
        assert($("#" + this.id).length, "Id assigned to activity must exist");
    }

    // Store the router as an instance because I don't know how to singleton
    this.router = router_in;

    // this is the public state that the controller fetches from the hash link
    // in the url in the browser
    this.public_state = {};

    // This is the private state of the activity.  Store all data here
    this.private_state = {};

    // Get a default ajax requester for this activity
    this.ajax_requester = new AjaxRequester();
}

/*
 *      Lifecycle methods
 *
 * on_show() is called after the activity has been put on the screen, any
 * and all ajax motives you have should be done here.  The page should be
 * shown completely on the screen with a callback here that calls the
 * Activity::redraw function to lay out any templates (for example
 * Handlebar templates that you might have)
 *
 * on_show() being called with private_state_in indicates that some of the
 * data that the activity needs (which would usually have been fetched with
 * AJAX calls) is already there, so be sure to multiplex your network calls
 * based on that.
 *
 * on_hide() is called before the activity disappears from sight.  Browser
 * specific things like storing data in cookies for further use should be done
 * here.
 */
Activity.prototype.before_show = function() {};
Activity.prototype.on_show = function(private_state_in) {};
Activity.prototype.on_hide = function() {};

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
Activity.prototype.redraw = function() {};

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
    this.router.remove_progress_bar();
    $('#' + this.id).fadeIn(FADE_MS);
};

/*
 * A utility function that can be used to redraw the handlebar template
 * with the given id and put the resulting html in the given placeholder
 * with the given context
 */
Activity.prototype.redraw_handlebar_template_with_context = function(template,
        placeholder, context) {

    // print useful debugging information to the console
    console.log("Compiling handlebar template with the id " + 
            template + "... With context .. ");
    console.log(context);
    console.log("Trying to put this resulting html at placeholder " 
            + placeholder);

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

    // Call callbacks
    this.on_hide();

    // Hide views from screen
    if (typeof milli_seconds_to_fade_out === 'undefined') {
        $('#' + this.id).hide();
    } else {
        $('#' + this.id).fadeOut(milli_seconds_to_fade_out);
    }
};

/*
 * Use this function to show the views for this activity on the screen,
 * the private_state_in parameter can be used to pass in data to this
 * activity.
 */
Activity.prototype.show = function(private_state_in) {
    
    // get the public state from the browser and set back the state of the
    // browser to match the state of the activity.  This is done here even
    // after getting the state from the browser for the case when the
    // default public state is not even provided when the activity's show
    // function is called
    this.public_state = this.get_state_from_browser_link();
    this.reflect_change_in_state_for_activity();

    // call the appropriate callback that the deriver can change to suit
    // his AJAX-ridden motives, if he returns a string they want to switch
    // to then switch and dont show the views for this screen
    // NEED TO CALL show_views() to show things
    this.on_show(private_state_in)
};

Activity.prototype.get_state_from_browser_link = function() {

    // parse out the current state from the browser
    try {
        return JSON.parse(JSON.parse(window.location.hash
                    .split('#' + this.hashLink + '/')[1].trim()));
    } catch (err) {
        return {};
    }
};

Activity.prototype.reflect_change_in_state_for_activity = function() {

    // this does not need a pound sign ('#') to be in the rvalue string,
    // the pound sign is added automatically
    window.location.hash = this.construct_state_for_browser_url();
};

Activity.prototype.construct_state_for_browser_url = function() {
    
    // concatenate the id for the activity with the public state and
    // return
    return this.id + '/' + JSON.stringify(this.public_state);
};
/**************************************************************************
 * PRIVATES
/*************************************************************************/
