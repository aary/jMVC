/*
 *      Router.js
 *
 * This module contains the methods that are used to manipulate the browser
 * url and load the different activities on the screen.  
 *
 * This module contains the code that is supposed to go in the script.js file.
 * Switching between activities should also be done via calls to Router
 * methods (in most cases the Router.prototype.switch_to() method works for
 * this purpose)
 */

function Router() {
    
    /*
     * The maps from the activity ids to the Activity objects.  The activity ids
     * should match directly from the id used in the activity constructor and
     * should be the same as in the HTML
     */
    this.public_activities = {};
    this.private_activities = {};

    /* A pointer to the current activity that is on the screen */
    this.current_activity = undefined;

    /* add the progress bar to the body */
    this.add_progress_bar_to_body();
}

/* 
 * Parses the url in the browser and routes to that activity, if the url
 * is invalid or if the activity is private then this falls back to the
 * default activity.
 */
Router.prototype.route_to_current_activity = function() {
    hash_url = window.location.hash;
    
    // parse out the hash url and the public json data
    // If there is no hash in the link then redirect to default page
    current_activity_id_from_hash = '';
    if (hash_url !== '') {

        // split the link between the # and consider the latter part
        current_activity_id_from_hash = hash_url.split('#')[1];
        if ((typeof current_activity_id_from_hash === undefined) ||
                (current_activity_id_from_hash === '')) {
            current_activity_id_from_hash = '';

        } else {

            // Get the array, split between the '/'
            // Make the activity_id the 0th index, and make the url_data the part 
            // after the '/' and if there is any problem syntactically then make
            // url_data an empty object
            split_array = current_activity_id_from_hash.split('/');
            current_activity_id_from_hash = split_array[0];
        }
    }

    // route to the activity gotten from the hash url, if no public
    // activity exists with the given id then this goes straight to the
    // default public activity
    this.route_to_public(current_activity_id_from_hash);
};

/*
 * This function is used to swap between two activities, it calls the
 * activity::hide() method and then calls the show() method on the other
 * activity.
 */
Router.prototype.switch_to = function(activity_id_in) {

    // Assert that there is an activity called activity_id_in
    assert(activity_id_in in this.public_activities || 
            activity_id_in in this.private_activities, 
            "Cannot call switch_to() to an activity that does not exist");
    
    if (activity_id_in in this.public_activities) {
        this.current_activity.hide();
        this.route_to(activity_id_in);
    } else if (activity_id_in in this.private_activities) {
        this.current_activity.hide();
        this.route_to(activity_id_in);
    }
};

/* 
 * Gets the public state for the activity encoded in the url as a JSON 
 * object 
 */
Router.prototype.get_public_activity_state = function() {

    try {
        // Get the string before the 
        var public_state = window.location.hash.split("#/")[1].split("/")[1];
        console.log(public_state);

        return JSON.parse(public_state);
    } catch (err) {
        return {};
    }
};

/* Called when an activity changes its public state */
Router.prototype.set_public_activity_state = function(
        public_activity_state) {

    // set the link after the hash tag to match the state of the object
    // TODO Change this from pure JSON to url encoded JSON maybe?
    try {
        window.location.hash = "/" + this.current_activity.id + "/" + 
            JSON.stringify(public_activity_state);
    } catch (err) {
        window.location.hash = "/" + this.current_activity.id + "/{}";
    }
};


/**************************************************************************
 *                          PRIVATE METHODS                               *
 **************************************************************************/
/* 
 * Setter for the public activities, give this a dictionary with activity
 * ids that map to the appropriate activity object
 */
Router.prototype.set_public_activities = function(public_activities_in) {
    this.public_activities = public_activities_in;
};

/* 
 * Setter for the private activities, give this a dictionary with activity
 * ids that map to the appropriate activity object
 */
Router.prototype.set_private_activities = function(private_activities_in) {
    this.private_activities = private_activities_in;
};

/* 
 * Adds a progress bar to the body, this should be removed as soon as
 * the views for an activity are displayed on screen with the
 * remove_progress_bar function
 */
Router.prototype.add_progress_bar_to_body = function() {
    $('body').append('<div style="height:100%;" class="container" \
            id="progress_bar"><div class="progress" \
            style="margin-top:0%;"><div class="progress-bar" \
            id="inner_progress_bar" \
            role="progressbar" aria-valuenow="70" aria-valuemin="0" \
            aria-valuemax="100" style="width:10%"></div></div></div>');

    // increase progress periodically
    this.current_progress = 10;
    this.progress_bar_interval_id = setInterval(function() {

        this.current_progress = 
            (this.current_progress >= 94) ? 
            (94) : 
            this.current_progress + 12;
        $("#inner_progress_bar").css("width", 
            (this.current_progress).toString() + "%");
    }.bind(this), 300);
};
Router.prototype.remove_progress_bar = function() {
    // clear the interval and remove the div
    clearInterval(this.progress_bar_interval_id);
    $("#progress_bar").css("display", "none");
};

/*
 * This function does no checking whatsoever and simply displays the given
 * activity id on the screen.  It looks first in the public activities
 * section and then looks in the private activities section for the given
 * activity
 */
Router.prototype.route_to = function(activity_id_in) {
    
    if (activity_id_in in this.public_activities) {
        this.current_activity = this.public_activities[activity_id_in];
        this.public_activities[activity_id_in].show();
    } else if (activity_id_in in this.private_activities) {
        this.current_activity = this.private_activities[activity_id_in];
        this.private_activities[activity_id_in].show();
    }
};

/*
 * Routes to the public activity given, if none exists with the specified
 * id then this routes to the default activity by calling
 * route_to_default_activity()
 */
Router.prototype.route_to_public = function(activity_id_in) {

    // if the activity with the given id does no exist then route to the
    // default and recurse from there?
    if (!(activity_id_in in this.public_activities)) {
        this.route_to_default_activity();
    } else {
        this.route_to(activity_id_in);
    }
};

/* The default activity is the first in the public_activities list */
Router.prototype.route_to_default_activity = function() {

    // Assert to check that there is a default public activity
    assert(!$.isEmptyObject(this.public_activities));
    
    // route to the appropriate default activity
    this.route_to(Object.keys(this.public_activities)[0]);
};
/**************************************************************************
 *                          PRIVATE METHODS                               *
 **************************************************************************/
