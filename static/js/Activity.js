FADE_MS = 500;

function Activity(id_in, router_in) {

    /*
     * set the public ID for the current activity, this should correspond
     * exactly to the id tag of the div that contains the controller's
     * frontend in the html
     * TODO Add assert that checks for the presence of the specified id in the
     *      html
     */
    this.id = id_in;

    /*
     * Store the router as an instance here
     */
    this.router = router_in;

    /*
     * this is the public state that the controller fetches from the hash link
     * in the url in the browser
     */
    this.public_state = {};

    /*
     * this is the private state of the activity.  This is entirely maintained
     * by the activity internally. 
     */
    this.private_state = {};

    /* Get a default ajax requester for this activity */
    this.ajax_requester = new AjaxRequester();
}

Activity.prototype = {
    /*
     * Lifecycle methods
     * on_show() is called after the activity has been put on the screen, any
     * and all ajax motives you have should be done here.  The page should be
     * shown completely on the screen with a callback here that calls the
     * Activity::redraw function to lay out any templates (for example
     * Handlebar templates that you might have)
     *
     * on_hide() is called before the activity disappears from sight.
     * Overload these with the code you want to execute before the screen is
     * filled with the html for the current activity
     */
    on_show   : function(optional_data) { },
    on_hide   : function() { },

    /*
     * Use this to hide the activity from sight
     */
    hide : function(milli_seconds_to_fade_out) {

        console.log("Activity::hide()");

        // Call callbacks
        this.on_hide();

        // Hide views from screen
        if (typeof milli_seconds_to_fade_out === 'undefined') {
            $('#' + this.id).hide();
        } else {
            $('#' + this.id).fadeOut(milli_seconds_to_fade_out);
        }
    },

    /*
     * Use this function to show the views for this activity on the screen,
     * the optional_data parameter can be used to pass in data to this
     * activity.  
     */
    show : function(optional_data) {
        
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
        this.on_show(optional_data)
    },

    /*
     * Used to show the views on the screen, if called with a null parameter
     * or no parameter at all then this does not fade the views in.  Otherwise
     * the parameter should be the number of milliseconds the fading in of the
     * views should take.
     */
    show_views : function() {
        
        $('#' + this.id).fadeIn(FADE_MS);
    },

    /*
     * used to redraw the screen.  All code that is used for this purpose has
     * to go in here
     */
    redraw : function() {},

    /*
     * A utility function that can be used to redraw the handlebar template
     * with the given id and put the resulting html in the given placeholder
     * with the given context
     */
    redraw_handlebar_template_with_context : function(template,
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
    },

    make_post_request_to_url : function(url_in, data, callback) {
        
        // make post request
        $.ajax({
            type: "POST", url: url_in,
            contentType: "application/json", dataType: "JSON", 
            data: JSON.stringify(data),

            success: function(data) {
                callback();
            }
        });
    },



    /**************************************************************************
     * PRIVATES
    /*************************************************************************/
    get_state_from_browser_link : function() {

        // parse out the current state from the browser
        try {
            return JSON.parse(JSON.parse(window.location.hash
                        .split('#' + this.hashLink + '/')[1].trim()));
        } catch (err) {
            return {};
        }
    },

    reflect_change_in_state_for_activity : function() {

        // this does not need a pound sign ('#') to be in the rvalue string,
        // the pound sign is added automatically
        window.location.hash = this.construct_state_for_browser_url();
    },

    construct_state_for_browser_url : function() {
        
        // concatenate the id for the activity with the public state and
        // return
        return this.id + '/' + JSON.stringify(this.public_state);
    }
    /**************************************************************************
     * PRIVATES
    /*************************************************************************/
};

