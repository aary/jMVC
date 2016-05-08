/*
 *      Bootloader.js
 *
 * This file contains the initial code for the library, like making all views
 * invisible to start and to import all the needed library files into the html
 *
 * Really wanted to call this Bootstrap.js but ...
 */

/* This class has all the boot methods */
function Bootloader() {};

$(document).ready(function() {
    var bootloader = new Bootloader();
    bootloader.boot(); // to be explicit
});

/* Boot function.  This function initializes the library. */
Bootloader.prototype.boot = function() {

    // the router make it a singleton
    assert(!("router" in window), "A router instance already exists in " + 
            "window");
    window.router = new Router();
    this.router = window.router;

    // initialize all the controllers and add them to the router
    this.link_activities_to_router();

    // route to the appropriate activity
    this.router.route_to_current_activity();
};

/* 
 * This function looks for all divs with the id jmvc-controller and makes them
 * all invisible.  This also adds all the controllers to the router
 */
Bootloader.prototype.link_activities_to_router = function() {

    // set up the path things
    this.router.set_path_to_activities(this.get_path_map_from_dom());
    
    // set up the path for all the activities
    // var id_to_controller_object = this.id_to_controller_object_for_activities();
    // this.router.set_public_activities(id_to_controller_object);
}


/*******************************************************************************
 *                            PRIVATE HELPER METHODS                           *
 ******************************************************************************/
Bootloader.prototype.get_path_map_from_dom = function() {

    var object_to_return = {};

    // first get all the objects that are at the top level
    var top_level = $("body").children("Activity");
    top_level.each(function(index, value) {

        var controller_for_value = $(value).attr("controller");
        var path_for_value = $(value).attr("path");
        object_to_return[$(value).attr("path")] = {
            "activity": 
                new window[controller_for_value](path_for_value), 
            "children": {}
        };
    });

    // now loop through them and recurse, passing the children object into
    // each one of the recursive calls
    $.each(object_to_return, function(path, value) {
        this.fill_in_each_child(path, value.children);
    }.bind(this));

    console.log(JSON.stringify(object_to_return, null, 10));
    return object_to_return;
};

Bootloader.prototype.fill_in_each_child = function(path, children_map) {
    
    // loop through and find all the children of the activity with path given
    // add those to the children map
    console.log("given path ", path);
    $("Activity[path='" + path + "']").children("Activity").each(
        function(index, value) {

        var controller_for_value = $(value).attr("controller");
        var path_for_value = $(value).attr("path");
        console.log(controller_for_value);
        console.log(path_for_value);
        children_map[$(value).attr("path")] = {
            "activity": 
                new window[controller_for_value](path_for_value), 
            "children": {}
        };
    });

    // now recurse
    $.each(children_map, function(path, value) {
        this.fill_in_each_child(path, value.children);
    }.bind(this));
};
