/**
 * \file Router.js
 * \author Aaryaman Sagar (rmn100@gmail.com)
 * \brief This module contains the methods that are used to manipulate the 
 *        browser url and load the different activities on the screen.  
 *
 * This module contains the code that is supposed to go in the script.js file.
 * Switching between activities should also be done via calls to Router
 * methods (in most cases the Router.prototype.switch_to() method works for
 * this purpose)
 */

function Router() {}

/**
 * \brief Called by the boot loader when the page loads
 *
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

/**
 * \brief Called to switch to an activity with the given path tag
 * \param activity_path is a string that contains the tagName for an activity
 *        that is to be routed to.
 *
 * To route to this activity <Activity path="index" /> the router function
 * that should be called is jmvc.router.switch_to("index")
 */
Router.prototype.switch_to = function(activity_path) {

    // get the path corresponding to the activity id and route to it
    var path = this.inverted_index_activity_path[activity_path];
    this.route_to(path);
}

/** 
 * \brief Gets the public state for the activity encoded in the url as a JSON 
 *        object 
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

/**
 * \brief Called when an activity changes its public state 
 */
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
/* Gets the path from the url */
Router.prototype.get_path_from_url = function(url) {

    // get the url without the hash
    if (url.indexOf("?") !== -1) {
        url = url.substring(0, url.indexOf('?'));
    }
    url = url.split("#").slice(-1)[0];

    // the path at which the current page is
    path = url.split("/");

    // remove all "" and then add one in the begining
    path = path.filter(function(element) {
        return element !== "";
    });
    path.unshift("");
    return path;
};
Router.prototype.get_url_from_path = function(path) {
    return "/" + path.join("/");
}

/**************************************************************************
 *                          PRIVATE METHODS                               *
 **************************************************************************/
