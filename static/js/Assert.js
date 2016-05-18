/*
 * \file Assert.js
 * \author Aaryaman Sagar (rmn100@gmail.com)
 * \brief This file provides simple a simple assert() function
 */

function assert(condition, message) {
    if (!condition) {
        message = "Assertion failed : " + message;
        if (typeof Error !== "undefined") { // JS IS SO WEIRD
            var error = new Error(message);
            console.log(error.stack);
            alert(message + "\n" + error.stack);
            throw error;
            return;
        }
        alert(message);
        throw message; // Fallback
    }
}
