function Question(question, key, answerType = 'text') {
    this.question = question;
    this.key = key;
    this.answerType = answerType;
}

Question.prototype.ask = function() {
    app.setQuestionText(this.question);
    app.setCurrentValue('');
}

app = {
    questions:[
        new Question('Hi! What\'s your name?', 'name'),
        new Question('What\'s your major?', 'major'),
        new Question('What do you want to contribute?', 'contrib'),
        new Question('What do you want to learn?', 'learn'),
        new Question('That\'s it! Thanks for signing up. :)', '', 'wait')
    ],
    setQuestionText: function(text) {
        document.getElementById('text').innerText = text;
    },
    questionIndex:0,
    acc:{},
    currentQuestion: function() {
        return this.questions[this.questionIndex];
    },
    currentValue: function() {
        document.getElementById('answer').value;
    },
    setCurrentValue: function(t) {
        document.getElementById('answer').value = t;
    },
    advance: function() {
        this.acc[this.currentQuestion().key] = this.currentValue();
        this.questionIndex++;
        if (this.questionIndex >= this.questions.length) {
            this.save(this.acc);
            this.acc = {};
            this.questionIndex = 0;
        }
        this.show();
    },
    show: function() {
        this.currentQuestion().ask();
    },
    save: function(acc) {

    }
}

function init() {
    window.onkeypress = function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (app.currentValue()) {
                app.advance();
            }
        }
    }
    app.show();
}