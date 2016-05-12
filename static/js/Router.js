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

function Router() {

    // a map from path to list of activity ids that have to go through for
    // the path
    this.path_ids = {};
}

/** 
 * \brief Boots the router.  Called by the bootloader.
 *
 * This walks the DOM and sets up the inverted index from pathnames to the
 * path that is to be taken to get there and stores said inverted index as a
 * member variable in the router
 */
Router.prototype.boot = function() {
    
    // a stack for depth first searching
    var stack = [];

    // add the initial node and then loop, using stack because thats my only
    // choice here
    stack.push({
        "id" : 0,
        "parents" : []
    });

    // DFS
    while (stack.length) {

        // get the current node from the stack and get its children
        var current_node = stack[stack.length - 1];
        var current_children = DomHelper.immediate_children(
                $("#" + current_node.id), "Activity");
        current_node_path = $("#" + current_node.id).attr("path");
        stack.pop();

        // check whether the element has a path tag, if it does then it is
        // useful for society
        if (current_node_path) {
            this.path_ids[current_node_path] = current_node.parents.slice();
            this.path_ids[current_node_path].push(current_node.id);
        }

        // add children to the current node to the stack 
        $.each(current_children, function(index, value) {

            assert($(value).attr("id"));
            stack.push({
                "id" : $(value).attr("id"),
                "parents" : current_node.parents.slice()
            });
            stack[stack.length - 1].parents.push(current_node.id);
        });
    }
    console.log(this.path_ids);
};

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
    console.log("path is ", path);

    // route to the activity gotten from the hash url, if no public
    // activity exists with the given id then this goes straight to the
    // default public activity
    // this.route_to(path);
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
