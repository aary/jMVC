/*
 *      config.js
 *
 * This file contains the global variable CONFIG that contains the
 * configuration options for this library. 
 */
CONFIG = {

    // The seconds an Activity takes to fade in
    FADE_MS : 500,

    // The time in between checks for completion for a queue of requests For
    // really lightning fast rechecks, I don't care about performance with a
    // language which is threaded but pretends to be single threaded.  That
    // just leads to bad code that "just works"
    TIME_BETWEEN_CHECKS : 1
};
