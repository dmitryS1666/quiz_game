let currentQuestionIndex = 0;
let score = 0;
let settings = {
    music: true,
    vibration: true
};

// Сохранение настроек в LocalStorage
function saveSettings() {
    localStorage.setItem('quizSettings', JSON.stringify(settings));
}

// Загрузка вопросов из файла JSON
async function loadQuestions() {
    const response = await fetch('questions.json');
    const questions = await response.json();
    return questions;
}

//  // Получаем элемент чек-бокса
// const checkbox = document.getElementById('toggle-checkbox');
//
// // Добавляем обработчик события на изменение состояния чек-бокса
// checkbox.addEventListener('change', function() {
// if (checkbox.checked) {
// console.log('Чек-бокс включен (ON)');
// } else {
//     console.log('Чек-бокс выключен (OFF)');
// }
// });

// Отображение вопроса
function showQuestion(question) {
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');

    questionElement.innerText = question.question;
    answerButtonsElement.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(index, question.correct));
        answerButtonsElement.appendChild(button);
    });
}

// Выбор ответа и обновление счета
function selectAnswer(selectedIndex, correctIndex) {
    if (selectedIndex === correctIndex) {
        score += 200;
    } else {
        alert('Wrong! Try again tomorrow.');
    }
    localStorage.setItem('quizScore', score);
    document.getElementById('score').innerText = score;
    nextQuestion();
}

// Переход к следующему вопросу
function nextQuestion() {
    loadQuestions().then(questions => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            alert('Congratulations! You finished the quiz.');
            currentQuestionIndex = 0; // начать сначала
            showQuestion(questions[currentQuestionIndex]);
        }
    });
}

// Сброс игры
function resetGame() {
    score = 0;
    currentQuestionIndex = 0;
    localStorage.clear();
    loadQuestions().then(questions => showQuestion(questions[0]));
}

document.getElementById('resetGame').addEventListener('click', resetGame);

// Инициализация игры
loadSettings();
loadQuestions().then(questions => {
    showQuestion(questions[currentQuestionIndex]);
});
