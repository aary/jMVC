function Router(hash_url) {

    /*
     * The current activity id for the browser.  This is set to a string.
     * This is a string and not an activity object.  This is a string because
     * JavaScript is weird.  Although my coding style is not yet to par, I
     * want to avoid stupid double references where not intended.  And since
     * objects are all maps it makes sense to refer to an object via key.
     */
    this.activity_id = '';

    /*
     * The data contained in the json object after the activity id
     */
    this.url_data = {};

    /*
     * the map with the activity id to activity objects, this is in essence
     * the routes for the class
     */
    this.activity_id_to_activities = {};

    /*
     * The default activity to route to in the case when there is no hash link
     * or when the hash link is not appropriate.  This is a string and not an
     * activity object.  This is a string because JavaScript is weird.
     * Although my coding style is not yet to par, I want to avoid stupid
     * double references where not intended.  And since objects are all maps
     * it makes sense to refer to an object via key.
     */
    this.default_activity_id = '';


    // If there is no hash in the link then redirect to default page
    if (hash_url !== '') {

        // split the link between the # and consider the latter part
        this.activity_id = hash_url.split('#')[1];
        if ((typeof this.activity_id === undefined) || (this.activity_id === '')) {
            this.activity_id = '';

        } else {

            // Get the array, split between the '/'
            split_array = this.activity_id.split('/');
            
            // Make the activity_id the 0th index, and make the url_data the part 
            // after the '/' and if there is any problem syntactically then make
            // url_data an empty object
            this.activity_id = split_array[0];
            try {
                this.url_data = JSON.parse(split_array[1]);
            } catch (error) {
                this.url_data = {};
            }
        }

    }

    console.log("activity_id is " + this.activity_id);
    console.log("url_data is " + JSON.stringify(this.url_data));
}

Router.prototype = {

    /*
     * Sets the map from activity ids to the activity objects
     */
    set_activities : function(activity_id_to_activities_in) {
        this.activity_id_to_activities = activity_id_to_activities_in;
    },

    /*
     * Sets the default activity for the case when the hash value is not set
     * in the browser
     */
    set_default : function(activity_in) {
        this.default_activity_id = activity_in;
    },
    
    /*
     * Routes to display the appropriate activity.  If no hash link or if the
     * hash link is inappropriate then this routes to the default activity
     * that was set by the call to the function set_default.
     */
    route_to_activity : function(milli_seconds_to_fade_in) {

        // TODO assert that there is a default

        if (this.activity_id_to_activities[this.activity_id]) {
            this.activity_id_to_activities[this.activity_id]
                .show(milli_seconds_to_fade_in);
        } else {
            // TODO assert(key_present_in_map);

            // go to the appropriate activity and then set the hash link to
            // match the activity
            this.activity_id_to_activities[this.default_activity_id]
                .show(milli_seconds_to_fade_in);
        }
    }
};
