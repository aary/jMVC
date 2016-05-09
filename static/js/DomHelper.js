/**
 * \file DomHelper.js
 * \author Aaryaman Sagar (rmn100@gmail.com)
 *
 * \brief This module contains extra methods that might be helpful in the
 *        context of this library that jQuery does not provide
 */

/* Only contains static functions so this is a namespace and not a class */
DomHelper = {};

/**
 * \brief Returns children only till the first level of the passed in object
 *
 * \param jquery_object  The object whose children are being inspected
 * \param tag_name  The tag names that are to be returned.  For example if
 *        you want all the divs that are the child of this element then you
 *        would pass in 'div' to this parameter
 * \return Returns an array of children objects.  These are not jquery objects
 *         so you would need to wrap them in a $() call if you require jQuery.
 *
 * Strips out all the tags from the DOM (virtually, so does not affect the
 * actual DOM) that are not of the tag_name passed in.  This then returns the
 * children of the passed in jquery object that are only one level deep.
 */
DomHelper.immediate_children = function(jquery_object, tag_name) {};


/******************************************************************************
 *                              IMPLEMENTATIONS                               *
 *****************************************************************************/
DomHelper.immediate_children = function(jquery_object, tag_name) {

    // make string all upper case and assert if one was not passed in
    assert(jquery_object !== undefined && tag_name !== undefined);
    tag_name = tag_name.toUpperCase();
    
    // the object to return
    var array_of_children = [];

    // call recursive implementation
    DomHelper.immediate_children_helper(jquery_object, tag_name,
            array_of_children);
    return array_of_children;
};

DomHelper.immediate_children_helper = function(jquery_object, tag_name, 
        array_of_children) {

    // loop through the children and add them to the list if they are
    // activities, else recurse and find its children until hit either no more
    // children
    $.each($(jquery_object).children(), function(index, value) {
        if ($(value).prop("tagName") == tag_name) {
            array_of_children.push(value);
        }
        else {
            DomHelper.immediate_children_helper(value, tag_name,
                array_of_children);
        }
    });
};
