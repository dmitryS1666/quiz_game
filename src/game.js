import { settings, loadSettings, saveSettings } from './settings.js';
import { switchScreen } from './ui.js';

// Проверка даты последнего вопроса дня
function checkQuestionOfTheDay() {
    const lastQuestionDate = localStorage.getItem('lastQuestionDate');
    const today = new Date().toLocaleDateString();

    if (lastQuestionDate !== today) {
        showQuestionOfTheDay();
    } else {
        startMainGame();
    }
}

// Загрузка вопросов дня из файла JSON
async function loadDailyQuestions() {
    const response = await fetch('questions.json');
    const questions = await response.json();
    return questions;
}

// Показать вопрос дня
async function showQuestionOfTheDay() {
    switchScreen('questionDay');

    const questions = await loadDailyQuestions();
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    displayDailyQuestion(question);
}

// Отображение вопроса дня и вариантов ответов
function displayDailyQuestion(question) {
    const questionElement = document.querySelector('#questionDay .question');
    const answerElements = document.querySelectorAll('#questionDay .item');

    questionElement.innerText = question.question;

    answerElements.forEach((element, index) => {
        element.querySelector('.text').innerHTML = `<b>${String.fromCharCode(65 + index)}:</b> ${question.answers[index]}`;
        element.onclick = () => handleDailyAnswer(index, question.correct);
    });
}

// Обработка ответа на вопрос дня
function handleDailyAnswer(selectedIndex, correctIndex) {
    let extraPoints = parseInt(localStorage.getItem('extraPoints')) || 0; // Приводим к числу или устанавливаем 0, если нет

    // Сохраняем дату последнего ответа на вопрос дня
    const today = new Date().toLocaleDateString();
    localStorage.setItem('lastQuestionDate', today);

    if (selectedIndex === correctIndex) {
        extraPoints += 2; // Добавляем 2 extra points за правильный ответ
        localStorage.setItem('extraPoints', extraPoints); // Сохраняем обновленные extra points
        switchScreen('winPage', true);
    } else {
        switchScreen('failPage');
    }
}

// Запуск основного игрового процесса
function startMainGame() {
    switchScreen('questionGame');
    loadQuestions().then(questions => {
        showQuestion(questions[0]);
    });
}

// Загрузка основных вопросов игры
async function loadQuestions() {
    const response = await fetch('questions.json');
    const questions = await response.json();
    return questions;
}

// Отображение основного вопроса игры
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

export { checkQuestionOfTheDay, loadQuestions, showQuestion };
