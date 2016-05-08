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
    this.get_path_map();
    
    // set up the path for all the activities
    var id_to_controller_object = this.id_to_controller_object_for_activities();
    this.router.set_public_activities(id_to_controller_object);
}


/*******************************************************************************
 *                            PRIVATE HELPER METHODS                           *
 ******************************************************************************/
Bootloader.prototype.id_to_controller_object_for_activities = function() {

    // The array of ids of all the controllers with the class jmvc-controller
    var idArray = [];
    $("body").children("Activity").each(function () {
        idArray.push(this.id);
    });

    // the object that is going to go in the router.set_*_activities()
    // function
    var object_to_return = {};

    // set up the activities in the router
    idArray.forEach(function(val, index) {

        // get the controller using a hack.  But then again javascript feels
        // like a hack itself
        var controller_object = new window[$("#" + val).attr("controller")](
            val);
        object_to_return[val] = controller_object;

        // make the controller invisible
        $("#" + val).css("display", "none");

    }.bind(this));

    return object_to_return;
};

Bootloader.prototype.get_path_map = function() {

    var object_to_return = {};

    // first get all the objects that are at the top level
    var top_level = $("body").children("Something");
    top_level.each(function(index, value) {
        object_to_return[$(value).attr("path")] = {"activity": {}, "children": {}};
    });

    // now loop through them and recurse, passing the children object into
    // each one of the recursive calls
    $.each(object_to_return, function(path, value) {
        this.fill_in_each_child(path, value.children);
    }.bind(this));
    console.log(JSON.stringify(object_to_return, null, 4));
};

Bootloader.prototype.fill_in_each_child = function(path, children_map) {
    
    // loop through and find all the children of the activity with path given
    // add those to the children map
    $("Something[path='" + path + "']").children("Something").each(
        function(index, value) {

        children_map[$(value).attr("path")] = {"activity":{}, "children":{}};
    });

    // now recurse
    $.each(children_map, function(path, value) {
        this.fill_in_each_child(path, value.children);
    }.bind(this));
};
    
Bootloader.prototype.id_to_controller_object_for_class = function(classname) {

    // The array of ids of all the controllers with the class jmvc-controller
    var idArray = [];
    $("." + classname).each(function () {
        idArray.push(this.id);
    });

    // the object that is going to go in the router.set_*_activities()
    // function
    var object_to_return = {};

    // set up the activities in the router
    idArray.forEach(function(val, index) {

        // get the controller using a hack.  But then again javascript feels
        // like a hack itself
        var controller_object = new window[$("#" + val).attr("controller")](
            val);
        object_to_return[val] = controller_object;

        // make the controller invisible
        $("#" + val).css("display", "none");
    }.bind(this));

    return object_to_return;
};

