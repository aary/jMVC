/*
 *      Assert.js
 *
 * This file provides simple a simple assert() function
 */

function assert(condition, message) {
    if (!condition) {
        message = "Assertion failed : " + message;
        if (typeof Error !== "undefined") {
            var error = new Error(message);
            console.log(error.stack);
            alert(message + "\n" + error.stack);
            return;
        }
        alert(message);
        throw message; // Fallback
    }
}
