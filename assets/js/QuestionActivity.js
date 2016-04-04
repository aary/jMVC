/*
 * Overriden constructor, inheritance pattern
 */
function QuestionActivity(id, fragmentLink, currentPublicState) {
    Activity.call(this, id, fragmentLink, currentPublicState);

    this.mQuestions = [];

    // Widgets
    this.mYesButton = {};
    this.mNoButton = {};
    this.mQuestionTextView = {};
}
QuestionActivity.prototype = new Activity();

/*
 * Lifecycle method
 */
QuestionActivity.prototype.onDisplay = function() {
    // load the questions from the json file
    this.mQuestions = [{"question":"Is 2*2 == 4 true?", "answer":true},
          {"question":"Is New Delhi the largest city in the world?", "answer":false},
          {"question":"Is Jon Snow going to become king?", "answer":true}];

    // Wire up widgets to the activity
    this.wireUpWidgets();

    // Display initial question
    this.mQuestionTextView.html(this.mQuestions[0].question);
}

/*
 * EFFECTS : Wires up widgets to the activity, links to html
 */
QuestionActivity.prototype.wireUpWidgets = function() {
    this.mQuestionTextView = $('#index_view_question_controller_question');
    this.mYesButton = $('#index_view_question_controller_yes_button');
    this.mNoButton = $('#index_view_question_controller_no_button');

    this.mYesButton.click($.proxy(function() {
        console.log("button pressed");
        for (var i in this.mQuestions) {
            if (this.mQuestions[i].question === this.mQuestionTextView.html()) {
                if (true === this.mQuestions[i].answer) {
                    $('#index_view_question_controller_answer_toast').html("Correct!").show().delay(1000).fadeOut()
                } else {
                    $('#index_view_question_controller_answer_toast').html("False!").show().delay(1000).toggle();
                }
            }
        }
    }, this));

    this.mNoButton.click($.proxy(function() {
        console.log("button pressed");
        for (var i in this.mQuestions) {
            if (this.mQuestions[i].question === this.mQuestionTextView.html()) {
                if (false === this.mQuestions[i].answer) {
                    $('#index_view_question_controller_answer_toast').html("Correct!").show().delay(1000).fadeOut()
                } else {
                    $('#index_view_question_controller_answer_toast').html('False!').show().delay(1000).fadeOut();
                }
            }
        }
    }, this));

}

