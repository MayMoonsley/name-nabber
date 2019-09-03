function Question(question, key, answerType = 'text') {
    this.question = question;
    this.key = key;
    this.answerType = answerType;
}

Question.prototype.ask = function() {
    app.setQuestionText(this.question);
    app.setCurrentValue('');
    switch (this.answerType) {
        case 'wait':
            window.setTimeout(function() {app.advance()}, 2000);
            app.hideField();
            break;
        case 'text':
            app.focus();
            app.showField();
            break;
    }
}

app = {
    questions:[
        new Question('Hi! What\'s your name?', 'name'),
        new Question('What\'s your email address?', 'name'),
        new Question('What\'s your major?', 'major'),
        new Question('What do you want to contribute?', 'contrib'),
        new Question('What do you want to learn?', 'learn'),
        new Question('That\'s it! Thanks for signing up. :)', '', 'wait')
    ],
    setQuestionText: function(text) {
        document.getElementById('text').innerText = text;
    },
    focus: function() {
        document.getElementById('answer').focus();
    },
    showField: function() {
        document.getElementById('answer').classList.remove('hidden');
    },
    hideField: function() {
        document.getElementById('answer').classList.add('hidden');
    },
    questionIndex:0,
    answers:[],
    acc:{},
    currentQuestion: function() {
        return this.questions[this.questionIndex];
    },
    currentValue: function() {
        return document.getElementById('answer').value;
    },
    setCurrentValue: function(t) {
        document.getElementById('answer').value = t;
    },
    updateObjectURL: function(json) {
        if (!json) {
            json = JSON.stringify(this.answers);
        }
        let blob = new Blob([json], {type: 'application/json'});
        if (this.objectURL) {
            window.URL.revokeObjectURL(this.objectURL);
        }
        this.objectURL = window.URL.createObjectURL(blob);
        document.getElementById('totalAnswers').href = this.objectURL;
    },
    advance: function() {
        if (this.currentQuestion().key) {
            this.acc[this.currentQuestion().key] = this.currentValue();
        }
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
        document.getElementById('totalAnswers').innerText = this.answers.length;
    },
    save: function(acc) {
        this.answers.push(acc);
        let json = JSON.stringify(this.answers);
        console.log(json);
        localStorage.setItem('answers', json);
        this.updateObjectURL(json);
    },
    wipe: function() {
        this.answers = [];
        localStorage.setItem('answers', '[]');
        this.show();
    }
}

function init() {
    let prev = localStorage.getItem('answers');
    if (prev) {
        app.answers = JSON.parse(prev);
    }
    window.onkeypress = function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (app.currentValue()) {
                app.advance();
            }
        }
    }
    app.show();
    app.updateObjectURL();
}