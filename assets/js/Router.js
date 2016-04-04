function Router(hashUrl) {
    var DEFAULT_HASH_LINK = '__default';

    this.hashLink = DEFAULT_HASH_LINK;
    this.urlData = {};

    // The hashLink-function callbacks
    this.routes = {};

    // If there is no hash in the link then redirect to default page
    if (hashUrl === '') {
        this.hashLink = DEFAULT_HASH_LINK;
    } else {
        this.hashLink = hashUrl.split('#')[1];
        if ((typeof this.hashLink === 'undefined') || (this.hashLink === '')) {
            this.hashLink = DEFAULT_HASH_LINK;
        } else {
            // Get the array, split between the '/'
            splitArray = this.hashLink.split('/');
            
            // Make the hashLink the 0th index, and make the urlData the part 
            // after the '/' and if there is any problem syntactically then make
            // urlData an empty object
            this.hashLink = splitArray[0];
            try {
                this.urlData = JSON.parse(splitArray[1]);
            } catch (error) {
                this.urlData = {};
            }
        }

    }
    console.log("hashLink is " + this.hashLink);
    console.log("urlData is " + JSON.stringify(this.urlData));


}
Router.prototype = {
    DEFAULT_HASH_LINK : '__default',

    setRoutes : function(hashLinkToCallbacks) {
        this.routes = hashLinkToCallbacks;
    },

    routeToActivity : function() {
        if (this.routes[this.hashLink]) {
            this.routes[this.hashLink](this.urlData);
        } else {
            this.routes['__default'](this.urlData);
        }
    }
};
