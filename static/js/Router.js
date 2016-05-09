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
    this.path_to_activities = {};
    this.inverted_index_activity_path = {};

    /* A pointer to the current activity that is on the screen */
    this.current_activity = undefined;

    // The event queue for things to happen, see route_to function for more
    // details
    this.event_queue = new Queue();
    this.current_path = [];

    /* add the progress bar to the body */
    this.add_progress_bar_to_body();
}

/* 
 * Parses the url in the browser and routes to that activity, if the url
 * is invalid or if the activity is private then this falls back to the
 * default activity.
 */
Router.prototype.route_to_current_activity = function() {
    
    // parse out the hash url and the public json data
    // If there is no hash in the link then redirect to default page
    var path = this.get_path_from_url(window.location.hash);

    // route to the activity gotten from the hash url, if no public
    // activity exists with the given id then this goes straight to the
    // default public activity
    this.route_to(path);
};

/* 
 * Gets the public state for the activity encoded in the url as a JSON 
 * object 
 */
Router.prototype.get_public_activity_state = function() {

    try {
        // Get the string before the 
        var public_state = window.location.hash.split("#/")[1].split("?")[1];
        return JSON.parse(public_state);
    } catch (err) {
        return {};
    }
};

/* Called when an activity changes its public state */
Router.prototype.set_public_activity_state = function(
        public_activity_state) {

    // set the link after the hash tag to match the state of the object
    // Change this from pure JSON to url encoded JSON maybe?
    try {
        window.location.hash = this.get_url_from_path(this.current_path) +
            "?" + JSON.stringify(public_activity_state);
    } catch (err) {
        // noop
    }
};


/**************************************************************************
 *                          PRIVATE METHODS                               *
 **************************************************************************/
/*
 * Used to set the nested map for path to activities.  For example if the HTML
 * is 
 *      <Activity path="" controller="IndexActivity">
 *      </Activity>
 *
 *      <Activity path="albums" controller="AlbumsActivity">
 *          <Activity path="create" controller="CreateAlbumActivity">
 *          </Activity>
 *
 *          <Activity path="view" controller="ViewAlbumsActivity">
 *          </Activity>
 *      </Activity>
 *
 * the object that should be set is 
 *      {
 *          "" :       {
 *                         "activity" : new IndexActivity();
 *                         "children" : []
 *                     },
 *          "albums" : {
 *                         "activity" : new AlbumsActivity();
 *                         "children" : [
 *                                          "create" : {
 *                                                          "activity" : 
 *                                                          "children" : []
 *                                                     },
 *                                          "view" :   {
 *                                                          "activity" : 
 *                                                          "children" : []
 *                                                     }
 *                                      ]
 *                     }
 *      }
 */
Router.prototype.set_path_to_activities = function(path_to_activities_in) {
    this.path_to_activities = path_to_activities_in;
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
 * This function accepts an array of path strings, for example the path can be
 * ['inbox', 'messages'] implying that the route is supposed to be
 * /inbox/messages.  The function then calls the appropriate lifecycle methods
 * on the activities by sending events to the ActivityGod class in order
 */
Router.prototype.route_to = function(path) {

    // construct the event queue from the path by checking which path elements
    // need not be worried about
    console.log("current path is ", this.current_path);
    console.log("routing to ", path);
    var i = 0;
    for (; i < this.current_path.length; ++i) {
        console.log("path[0] is ", path[0]);
        console.log("this.current_path[i] is ", this.current_path[i]);
        
        // then the path from this point on is correct
        if (i >= this.current_path.length) {
            break;
        }
        if (path[0] != this.current_path[i]) {
            break;
        }

        // pop_front
        path.shift();
        console.log("path after shifting is ", path);
    }
    console.log("point from current path for which to hide is ", i);
    console.log("path to show is ", path);

    console.log(jmvc.activities);
    // first hide the views that should hide
    for (var j = this.current_path.length - 1; j >= i; --j) {
        console.log("hiding ", this.current_path[j]);
        $.each(jmvc.activities[this.current_path[j]].events_for_hide(), 
                function(index, value) {
            this.event_queue.enqueue(value);
        }.bind(this));
    }

    $.each(path, function(index, value) {
        $.each(jmvc.activities[value].events_for_show(), 
                function(index, value) {
            this.event_queue.enqueue(value);
            // console.log(value.toString());
        }.bind(this));
    }.bind(this));
    console.log("formed event queue");

    // execute all the functions
    while(!this.event_queue.isEmpty()) {
        var thing = this.event_queue.dequeue();
        if (typeof thing === typeof "string") {
            // check if hide has finished
            if (thing === path[0]) {
                console.log("added ", path[0]);
                this.current_path.push(path[0]);
                path.shift();
            }
            else if (thing === 
                    this.current_path[this.current_path.length - 1]) {
                console.log("removed ", this.current_path[this.current_path.length - 1]);
                this.current_path.pop();
            }
        }
        else {
            thing();
        }
    }
    console.log("this current path is ", this.current_path);
};

/* The default activity is the first in the public_activities list */
Router.prototype.route_to_default_activity = function() {

    // Assert to check that there is a default public activity
    assert(!$.isEmptyObject(this.public_activities), 
            "router.public_activities cannot be empty");
    
    // route to the appropriate default activity
    this.route_to(Object.keys(this.public_activities)[0]);
};

/* Gets the path from the url */
Router.prototype.get_path_from_url = function(url) {

    // get the url without the hash
    if (url.indexOf("?") !== -1) {
        url = url.substring(0, url.indexOf('?'));
    }
    url = url.split("#/").slice(-1)[0];

    // the path at which the current page is
    path = url.split("/");
    if (path[path.length - 1] == "") { path.pop(); }
    return path;
};
Router.prototype.get_url_from_path = function(path) {
    return "/" + path.join("/");
}
/**************************************************************************
 *                          PRIVATE METHODS                               *
 **************************************************************************/
