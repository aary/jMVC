/**
 * \file JmvcException.js
 * \author Aaryaman Sagar (rmn100@gmail.com)
 * \brief This module provides an exception class to be used by the library,
 *        any exceptions that are thrown should inherit from this
 */


/**
 * \class JmvcException
 * \brief A generic exception class
 *
 * This module provides an exception class that is to be used by the library,
 * any exceptions that are thrown should inherit from this or risk breaking
 * the library's code
 */
function JmvcException(error_code_in, message_in) {

    this.message = message_in;
    this.error_code = error_code_in;
};

JmvcException.prototype = new Error();
JmvcException.constructor = JmvcException;
