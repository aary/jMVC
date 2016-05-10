function JmvcActivity(id_in) {
    // call the constructor for the base class
    Activity.call(this, id_in);
    console.log("constructing super");
}
JmvcActivity.prototype = new Activity();

JmvcActivity.prototype.render = function() {
    return "<h1>Hello World</h1>"
}
