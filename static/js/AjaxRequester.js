/*
 *      AjaxRequester.js
 *
 * This module contains functionality which can be used to make ajax requests
 * from Activities
 */
function AjaxRequester() {

    // the counter for the number of requests that have been registered
    this.number_of_requests = 0;
}

/*
 * This function makes a get request to the url specified, passing in the data
 * and then exeucting the callback that has been passed to it.  This function
 * increments the count for the number of requests that have been made before
 * and in the callback decrements the request count
 */
AjaxRequester.prototype.get = function(url_in, callback) {

    // add one to the number of requests here
    ++this.number_of_requests;

    $.getJSON(url_in, function(data) {

        // call the callback and then decrement the number of requests to show
        // that one request has finished
        --this.number_of_requests;
        callback(data);
    }.bind(this));
}

/*
 * This function makes a post request to the url specified, passing in the
 * data and then executing the callback that has been passed to it.  This
 * like the get request above keeps track of the number of requests that have
 * been made
 */
AjaxRequester.prototype.post = function(url_in, data, callback) {

    // add one to the number of requests here
    ++this.number_of_requests;

    $.ajax({
        type: "POST", url: url_in,
        contentType: "application/json", dataType: "JSON",
        data: JSON.stringify(data),

        success: function(data) {

            // call the callback and then decrement the number of requests to show
            // that one request has finished
            --this.number_of_requests;
            callback(data);
        }.bind(this)
    });
}

/* 
 * This function executes the passed in callback when all the requests are
 * done.  Very Inefficient.  I hate how javascript has threads without any
 * synchronization method.  If you know a better way to do this please let me
 * know.
 */
AjaxRequester.prototype.wait_for_all = function(callback) {

    // which scope does this have?
    // this is used to periodically check for condition() to return true and
    // then execute callback_in()
    function wait_for(condition, milliseconds, callback_in) {

        // if the condition is not met then wait and recurse, otherwise
        // callback()
        if (!condition()) {
            setTimeout(function() {
                wait_for(condition, milliseconds, callback_in);
            }, milliseconds);

        } else {
            callback_in();
        }
    }

    wait_for(function() { 
        return this.number_of_requests === 0; 
    }.bind(this), CONFIG.TIME_BETWEEN_CHECKS, function() { 
        callback(); 
    });
}
