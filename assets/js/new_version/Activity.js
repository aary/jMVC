function Activity(id_in) {

    /*
     * set the public ID for the current activity, this should correspond
     * exactly to the id tag of the div that contains the controller's
     * frontend in the html
     * TODO Add assert that checks for the presence of the specified id in the
     *      html
     */
    this.id = id_in;

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
}

Activity.prototype = {
    /*
     * Lifecycle methods
     * on_show() is called before the activity is about to be displayed on
     * the screen.  The optional_data parameter is passed in directly from the
     * show() function.  The public state need not be parsed here.
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

        // Call callbacks
        this.on_hide();

        // Hide views from screen
        if (typeof milli_seconds_to_fade_out === 'undefined') {
            $('#' + this.id).css('display', 'none');
        } else {
            $('#' + this.id).fadeOut(milli_seconds_to_fade_out);
        }
    },

    /*
     * Use this function to show the views for this activity on the screen,
     * the optional_data parameter can be used to pass in data to this
     * activity.  
     */
    show : function(milli_seconds_to_fade_in, optional_data) {
        
        // get the public state from the browser and set back the state of the
        // browser to match the state of the activity.  This is done here even
        // after getting the state from the browser for the case when the
        // default public state is not even provided when the activity's show
        // function is called
        this.public_state = this.get_state_from_browser_link();
        this.reflect_change_in_state_for_activity();

        // call the appropriate callback that the deriver can change to suit
        // his AJAX-ridden motives
        this.on_show(optional_data);

        // do what the function call says
        this.show_views(milli_seconds_to_fade_in);
    },

    /*
     * All event handlers such as ajax call handlers or button click handlers
     * should be decorated with the fucnctor returned fro this function.  This
     * ensures consistency in the activity and the public state AKA the
     * browser URL AKA the window.location.hash
     */
    decorate_callback : function(functor_to_decorate) {

        // WTF?? Yeah that's right. 
        return function() {
            functor_to_decorate();
            this.reflect_change_in_state_for_activity();
        };
    },

    /*
     * Used to show the views on the screen, if called with a null parameter
     * or no parameter at all then this does not fade the views in.  Otherwise
     * the parameter should be the number of milliseconds the fading in of the
     * views should take.
     */
    show_views : function(milli_seconds_to_fade_in) {
        
        if (typeof milli_seconds_to_fade_in === 'undefined') {
            $('#' + this.id).css('display', '');
        } else { 
            $('#' + this.id).fadeIn(milli_seconds_to_fade_in);
        }
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

