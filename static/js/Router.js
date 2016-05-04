function Router() {
    
    /*
     * The maps from the activity ids to the Activity objects.  The activity ids
     * should match directly from the id used in the activity constructor and
     * should be the same as in the HTML
     */
    this.public_activities = {};
    this.private_activities = {};

    /*
     * A pointer to the current activity that is on the screen
     */
    this.current_activity = undefined;
}

Router.prototype = {

    /*
     * This function does no checking whatsoever and simply displays the given
     * activity id on the screen.  It looks first in the public activities
     * section and then looks in the private activities section for the given
     * activity
     */
    route_to : function(activity_id_in) {
        
        if (activity_id_in in this.public_activities) {
            this.current_activity = this.public_activities[activity_id_in];
            this.public_activities[activity_id_in].show();
        } else if (activity_id_in in this.private_activities) {
            this.current_activity = this.private_activities[activity_id_in];
            this.private_activities[activity_id_in].show();
        }
    },

    /*
     * This function is used to swap between two activities, it calls the
     * activity::hide() method and then calls the show() method on the other
     * activity
     */
    switch_to : function(activity_id_in) {

        // TODO : Assert that there is an activity called activity_id_in
        
        if (activity_id_in in this.public_activities) {
            this.current_activity.hide();
            this.route_to(activity_id_in);
        } else if (activity_id_in in this.private_activities) {
            this.current_activity.hide();
            this.route_to(activity_id_in);
        }
    },

    /*
     * The default activity is the first in the public_activities list
     */
    route_to_default_activity : function() {

        // TODO Add assert to check that there is a default public activity
        
        // route to the appropriate default activity
        this.route_to(Object.keys(this.public_activities)[0]);
    },

    route_to_current_activity : function() {
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

        console.log("current_activity_id_from_hash is " + 
                current_activity_id_from_hash);
        
        // route to the activity gotten from the hash url, if no public
        // activity exists with the given id then this goes straight to the
        // default public activity
        this.route_to_public(current_activity_id_from_hash);
    },

    /*
     * Route to function, this simply displays the activity on the screen,
     * does nothing else
     */
    route_to_public : function(activity_id_in) {

        // if the activity with the given id does no exist then route to the
        // default and recurse from there?
        if (!(activity_id_in in this.public_activities)) {
            this.route_to_default_activity();
        } else {
            this.route_to(activity_id_in);
        }
    },

    set_public_activities : function(public_activities_in) {
        this.public_activities = public_activities_in
    },

    set_private_activities : function(private_activities_in) {
        this.private_activities = private_activities_in;
    }

};
    
