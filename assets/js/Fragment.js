/*
 * OVERVIEW : A Fragment controller class
 */
function Fragment(id, fragmentLink, currentPublicState) {
    // Display and hide its views in html using the id
    this.id = id;
    this.hashLink = fragmentLink;

    // Optional arguments to be attached to the contructor
    this.arguments = {};

    // true when object is displayed
    this.isHidden = false;

    // Current public state of the fragement, this goes into the window hash to
    // to let the user know where he is in the current fragment, 
    // THIS ALLOWS COPY PASTING URLS
    this.currentPublicState = (typeof currentPublicState === 'undefined' ? {} : 
            currentPublicState);
}

Fragment.prototype = {
    /*
     * Lifecycle methods
     * onDisplay() is called before the fragment is about to be displayed on the screen
     * onHide() before the fragment disappears from sight
     */
    onDisplay   : function() { },
    onHide      : function() { },

    /*
     * EFFECTS : Returns true if the fragment is hidden
     */
    isHidden    : function() { return isHidden; },

    /*
     * EFFECTS : Overridable function to create a new fragment with arguments
     */
    newInstance : function() { },

    /*
     * EFFECTS : Hides this fragment
     */
    hide : function(millisecondsToFadeOut) {
        // Call callbacks
        this.onHide();

        // Hide views from screen
        if (typeof millisecondsToFadeOut === 'undefined') {
            $('#' + this.id).css('display', 'none');
        } else {
            $('#' + this.id).fadeOut(millisecondsToFadeOut);
        }
    },

    /*
     * EFFECTS : Brings the fragment into display, sets the hashbang link to be the
     *           fragment identifier
     */
    show : function(millisecondsToFadeIn) {
        // Call callbacks
        this.onDisplay();

        // Set location hash in the url using the object variable hashLink
        window.location.hash = this.makeHashLink();

        // Show views on screen
        if (typeof millisecondsToFadeIn === 'undefined') {
            $('#' + this.id).css('display', '');
        } else { 
            $('#' + this.id).fadeIn(millisecondsToFadeIn);
        } 
    }, 

    /*
     * EFFECTS : Sets the currentPublicState of the fragment using the data in the 
     *           url
     */
    getCurrentPublicState : function() {
        try {
            this.currentPublicState = JSON.parse(JSON.parse(window.location.hash
                        .split('#' + this.hashLink + '/')[1].trim()));
        } catch (err) {
            // If error in parsing the json from url then go to stateless current
            // page
            this.currentPublicState = {};
        }
    },

    /*
     * EFFECTS : Sets the url to contain th stringified version of the 
     *           currentPublicState
     */
    setCurrentPublicState : function(currentPublicStateIn) {
        this.currentPublicState = currentPublicStateIn;
        window.location.hash = this.makeHashLink();
    },
    
    /*
     * EFFECTS : Constructs a hash link for the current fragment
     */
    makeHashLink : function() {
        return this.hashLink + '/' + JSON.stringify(this.currentPublicState);
    }
};
