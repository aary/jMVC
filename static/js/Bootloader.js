/*
 *      Bootloader.js
 *
 * This file contains the initial code for the library, like making all views
 * invisible to start and to import all the needed library files into the html
 *
 * Really wanted to call this Bootstrap.js but ...
 */

/* link the library to the window */
window.jmvc = {};

/* This class has all the boot methods */
function Bootloader() {};

$(document).ready(function() {
    var bootloader = new Bootloader();
    window.bootloader = bootloader;
    bootloader.boot(); // to be explicit
});

/* Boot function.  This function initializes the library. */
Bootloader.prototype.boot = function() {

    // the router make it a singleton
    assert(!("router" in jmvc), "A router instance already exists in " + 
            "window");
    jmvc.router = new Router();

    // render basic activity state for all the activities out there
    this.initialize_activities();

    // route to the appropriate activity
    jmvc.router.route_to_current_activity();
};

/* 
 * This function looks for all divs with the id jmvc-controller and makes them
 * all invisible.  This also adds all the controllers to the router
 */
Bootloader.prototype.link_activities_to_router = function() {

    // set up the big map, dont know if it is necessary
    jmvc.router.set_path_to_activities(this.get_path_map_from_dom());

    // set inverted index
    jmvc.router.inverted_index_activity_path = 
        this.get_inverted_index_from_path_map(jmvc.router.path_to_activities);
    console.log(jmvc.router.inverted_index_activity_path);
}

/**
 * \brief This sets up the main activities that have been entered into the HTML
 *        for the page at the moment.  Only operates on activities that do not
 *        have ids at the moment.  Them not having ids implies that they have
 *        not been linked with their parent activities or temporarily with the
 *        router.
 */
Bootloader.prototype.initialize_activities = function() {

    var activities_without_ids = $("Activity:not([id])");
    this.hide_activities(activities_without_ids);
    // this.set_unique_ids(activities_without_ids);
}

/**
 * \brief Hides all the activities passed in
 */
Bootloader.prototype.hide_activities = function(activities_without_ids) {
    assert(activities_without_ids !== undefined);

    $.each(activities_without_ids, function(index, value) {
        $(value).css("display", "none");
    });
}

/**
 * \brief This sets up all the activities passed in with unique ids
 */
Bootloader.prototype.set_unique_ids = function(activities_without_ids) {
    assert(activities_without_ids !== undefined);

    $.each(activities_without_ids, function(index, value) {
        assert($(value).attr("id") === undefined);
        $(value).attr("id", Bootloader.unique_id());
    });
};

/**
 * \brief Returns the next unique integer from the scope of the program
 * \bug This only goes up until the highest integer that the current
 *      JavaScript implementation can handle
 */
Bootloader.unique_id = function() {
    if (Bootloader.counter === undefined) {
        Bootloader.counter = 0;
    }
    return Bootloader.counter++;
}

/*******************************************************************************
 *                            PRIVATE HELPER METHODS                           *
 ******************************************************************************/
/* Gets a map from the DOM that maps the paths to the activities they use */
Bootloader.prototype.get_path_map_from_dom = function() {

    var path_to_activity_children = {};

    // first get all the objects that are at the top level
    $.each(this.get_immediate_children_for($("body")), function(index, value) {

        // extract the controller type and the path from the DOM element, make
        // map for children of the element
        var controller_for_value = $(value).attr("controller");
        var path_for_value = $(value).attr("path");
        path_to_activity_children[$(value).attr("path")] = {
            "activity": 
                new window[controller_for_value](path_for_value), 
            "children": {}
        };
    }.bind(this));

    // now loop through them and recurse, passing the children object into
    // each one of the recursive calls
    $.each(path_to_activity_children, function(path, value) {
        this.get_path_map_from_dom_helper(path, value.children);
    }.bind(this));

    // console.log(path_to_activity_children);
    return path_to_activity_children;
};

Bootloader.prototype.get_path_map_from_dom_helper = function(path, 
        path_to_activity_children) {

    // loop through and find all the children of the activity with path given
    // add those to the children map
    $.each(this.get_immediate_children_for(
            $("Activity[path='" + path + "']")), function(index, value) {

        var controller_for_value = $(value).attr("controller");
        var path_for_value = $(value).attr("path");
        path_to_activity_children[$(value).attr("path")] = {
            "activity": 
                new window[controller_for_value](path_for_value), 
            "children": {}
        };
    }.bind(this));

    // now recurse
    $.each(path_to_activity_children, function(path, value) {
        this.get_path_map_from_dom_helper(path, value.children);
    }.bind(this));
};

/* 
 * Skips all the children for the given jQuery element that are not Activities
 * and returns the children of that element
 */
Bootloader.prototype.get_immediate_children_for = function(element) {

    // the object to return
    var array_of_children = [];

    // call recursive implementation
    this.get_immediate_children_for_helper(element, array_of_children);
    return array_of_children;
};
Bootloader.prototype.get_immediate_children_for_helper = function(element, 
        array_of_children) {

    // loop through the children and add them to the list if they are
    // activities, else recurse and find its children until hit either no more
    // children
    $.each($(element).children(), function(index, value) {
        if ($(value).prop("tagName") == "ACTIVITY") {
            array_of_children.push(value);
        }
        else {
            this.get_immediate_children_for_helper(value, array_of_children);
        }
    }.bind(this));
};

/* 
 * Gets an inverted index from the path to the broken up path, so for
 * a path 'messages' this returns ["", "inbox", "messages"] since the messages
 * route is found at /inbox/messages
 */
Bootloader.prototype.get_inverted_index_from_path_map = function(path_map) {
    var stack_path = [];
    var inverted_index = {};
    this.get_inverted_index_from_path_map_helper(path_map, stack_path, 
            inverted_index);
    return inverted_index;
};

Bootloader.prototype.get_inverted_index_from_path_map_helper = function(path_map, 
        stack_path, inverted_index) {
    $.each(path_map, function(key, value) {

        // push the key onto the stack
        stack_path.push(key);

        // add the path for the current stack into the map
        inverted_index[key] = stack_path.slice();
        this.get_inverted_index_from_path_map_helper(value.children, stack_path, 
            inverted_index);

        // pop to add the next key
        stack_path.pop();
    }.bind(this));
};
