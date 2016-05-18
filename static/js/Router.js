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

/**
 * \class Router
 * \brief Class that provides routing functionality
 */
function Router() {

    // a map from path to list of activity ids that have to go through for
    // the path
    this.path_ids = {};

    // a tree of path entities that is represented by the user in HTML
    this.path_prefix_tree = {};

    // the current array that is being shown on the screen
    this.current_path = [];
};

/**
 * \class JmvcExceptionRouter
 * \brief Exception class for errors in the Router's internal code
 */
function JmvcExceptionRouter(message_in) {
    JmvcException.call(this, 100, message_in);
};
JmvcExceptionRouter.prototype = new JmvcException();
JmvcExceptionRouter.constructor = JmvcExceptionRouter;

/** 
 * \brief Boots the router.  Called by the bootloader.
 *
 * This walks the DOM and sets up the inverted index from pathnames to the
 * path that is to be taken to get there and stores said inverted index as a
 * member variable in the router
 */
Router.prototype.boot = function() {

    // construct the map from path to an array of indices, so that given a
    // path element the library knows which activities are to be shown to get
    // to that id
    this.construct_path_ids_map();
    console.log("Path id map is ");
    console.log(this.path_ids);

    // constructs the path tree for verification, this has been split up from
    // the function above just to decouple both functions
    this.construct_path_prefix_tree();
    console.log("Path tree is ");
    console.log(JSON.stringify(this.path_prefix_tree, null, 4));
};

/**
 * \brief Called by the boot loader when the page loads
 *
 * Parses the url in the browser and routes to that activity, if the url
 * is invalid or if the activity is private then this falls back to the
 * default activity.
 */
Router.prototype.route_to_current_activity = function() {
    
    // parse out the hash url and the public json data If there is no hash in
    // the link then redirect to default page
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
};

Router.prototype.route_to = function(path) {

    try {
        // validates the path with any of the given
        this.validate_path(path);

        // call the show method on the activity given in the path
        path.shift();
        jmvc.activities[0].show(path);

        // make the current path equal to path
        this.current_path = path;

    } catch (error) {
        throw error;
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
};

/* Helper method to create a path to ids map */
Router.prototype.construct_path_ids_map = function() {

    // a stack for depth first searching
    var stack = [];

    // add the initial node and then loop, using stack because thats my only
    // choice here
    stack.push({
        "id" : 0,
        "parents" : []
    });
    this.path_ids[""] = 0;

    // depth first
    while (stack.length) {

        // get the current node from the stack and get its children
        var current_node = stack[stack.length - 1];
        var current_children = DomHelper.immediate_children(
                $("#" + current_node.id), "Activity");
        var current_node_path = $("#" + current_node.id).attr("path");
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
};

Router.prototype.construct_path_prefix_tree = function() {

    // Get the top level activities and add them to the stack
    var stack = [];
    stack.push({
        "id" : 0,
        "children" : {} 
    });
    this.path_prefix_tree[""] = stack[0];

    while (stack.length) {
        
        // get the children for the current node, this gets tricky because
        // pointers are hidden in this language.  i still cant see why hiding
        // pointers leads to better code or provides for a better language in
        // general.  Browsers probably provide some sort of memory API (in C
        // maybe?) Know nothing about how things work under the hood
        var current_node = stack[stack.length - 1];
        var current_children = DomHelper.immediate_children(
                $("#" + current_node.id), "Activity");
        stack.pop();

        $.each(current_children, function(index, value) {

            // get the id and append it to the end of the current node
            var current_child_id = $(value).attr("id");
            var current_child_path = $(value).attr("path");
            assert(current_child_id);

            // construct the node to append to the children for the current
            // node
            var node_to_append = {
                "id" : current_child_id,
                "children" : {},
            };
            assert(!(current_child_path in current_node.children));
            current_node.children[current_child_path] = node_to_append;
            stack.push(node_to_append);
        }); 
    }
};

/*
 * Validates the path passed in the browser and makes sure that there exists a
 * valid activity combination for it
 */
Router.prototype.validate_path = function(path) {
    
    // follow the prefix tree to see if there is a valid path if we follow
    // the nodes in the path array
    var current_node = this.path_prefix_tree;
    $.each(path, function(index, value) {

        if (!(value in current_node)) {
            throw new JmvcExceptionRouter("Path does not exist");
        }
        current_node = current_node[value].children;
    });
};
