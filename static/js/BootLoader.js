/*
 *      BootLoader.js
 *
 * This file contains the initial code for the library, like making all views
 * invisible to start and to import all the needed library files into the html
 *
 * Really wanted to call this BootLoader.js but ...
 */

/* This class has all the boot methods */
function BootLoader() {};

$(document).ready(function() {
    var bootloader = new BootLoader();
    bootloader.boot(); // to be explicit
});

/* Called when the document has loaded */
BootLoader.prototype.boot = function() {

    // the router
    this.router = new Router();

    // initialize all the controllers and add them to the router
    this.initialize_controllers();

    // route to the appropriate activity
    this.router.route_to_current_activity();
};

/* 
 * This function looks for all divs with the id jmvc-controller and makes them
 * all invisible.  This also adds all the controllers to the router
 */
BootLoader.prototype.initialize_controllers = function() {
    
    // set up the public activities
    var id_to_public_activities_object = 
        this.id_to_controller_object_for_class("jmvc-public-controller");
    this.router.set_public_activities(id_to_public_activities_object);

    // set up the private activities
    var id_to_private_activities_object = 
        this.id_to_controller_object_for_class("jmvc-private_controller");
    this.router.set_private_activities(id_to_private_activities_object);
}


/*******************************************************************************
 *                              PRIVATE METHODS                                *
 ******************************************************************************/
BootLoader.prototype.id_to_controller_object_for_class = function(classname) {

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
            val, this.router);
        object_to_return[val] = controller_object;

        // make the controller invisible
        $("#" + val).css("display", "none");
    }.bind(this));

    return object_to_return;
};

