import { settings, loadSettings, saveSettings } from './settings.js';
import { switchScreen } from './ui.js';

const MAX_QUESTIONS_PER_ROUND = 10;
let mainPoints = parseInt(localStorage.getItem('mainPoints')) || 0;

// Функция для сохранения текущего прогресса игрока
function saveProgress(currentQuestionIndex) {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
}

// Функция для загрузки прогресса
function loadProgress() {
    return parseInt(localStorage.getItem('currentQuestionIndex')) || 0;
}

// Запуск основного игрового процесса
function startMainGame() {
    const currentQuestionIndex = loadProgress(); // Загружаем прогресс

    showInfoBlock(true, true, true);

    // Обновляем прогресс на экране
    updateProgressPage(currentQuestionIndex);

    const scoreValue = document.getElementById("scoreValue");
    if (scoreValue) {
        scoreValue.textContent = `${mainPoints}`;
    }

    switchScreen('questionGame'); // Переходим на экран игры
    loadQuestions().then(questions => {
        showQuestion(currentQuestionIndex, questions); // Показать вопрос с текущего индекса
    });
}

// Функция для сброса прогресса
function resetProgress() {
    localStorage.removeItem('currentQuestionIndex'); // Удаляем индекс текущего вопроса
    updateProgressPage(0); // Обновляем страницу прогресса, устанавливая ее на 0
}

// Отображение основного вопроса игры
let timer; // Переменная для таймера
async function showQuestion(currentQuestionIndex, questions) {
    const question = questions[currentQuestionIndex]; // Берем вопрос по индексу
    displayMainsQuestion(question, currentQuestionIndex);

    // Обновляем классы на progressPage
    updateProgressPage(currentQuestionIndex);
    // Запускаем таймер на 12 секунд
    startTimer(12);
    showInfoBlock(true, true, true);
}

// Запуск таймера
function startTimer(seconds) {
    let timeLeft = seconds;
    const timerDisplay = document.querySelector('#timer span'); // Обновляем span внутри элемента с id "timer"

    // Обновляем отображение таймера каждую секунду
    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60); // Получаем минуты
        const seconds = timeLeft % 60; // Получаем секунды

        // Форматируем время в формате 00:12
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer); // Очищаем интервал
            handleTimeUp(); // Обрабатываем истечение времени
        }
    }, 1000);
}

// Обработка истечения времени
function handleTimeUp() {
    clearInterval(timer); // Очищаем таймер
    const currentQuestionIndex = loadProgress(); // Получаем текущий индекс вопроса
    updateProgressPage(currentQuestionIndex);
    switchScreen('failPage'); // Переход на экран проигрыша, если время вышло
}

function displayMainsQuestion(question, currentQuestionIndex) {
    const questionElement = document.querySelector('#questionGame .question');
    const answerElements = document.querySelectorAll('#questionGame .item');

    questionElement.innerText = question.question;

    answerElements.forEach((element, index) => {
        element.querySelector('.text').innerHTML = `<b>${String.fromCharCode(65 + index)}:</b> ${question.answers[index]}`;
        element.onclick = () => handleMainAnswer(index, question.correct, currentQuestionIndex);
    });
}

// Обработка ответа на основной вопрос
function handleMainAnswer(selectedIndex, correctIndex, currentQuestionIndex) {
    clearInterval(timer); // Очищаем таймер при выборе ответа
    // Получаем очки за текущий уровень
    const currentItem = document.querySelector(`#progressPage .levels .item[data-level="${currentQuestionIndex + 1}"]`);
    const levelScore = parseInt(currentItem.getAttribute('data-score'));

    const scoreValue = document.getElementById("scoreValue");
    if (scoreValue) {
        scoreValue.textContent = `${mainPoints}`;
    }

    // Сохраняем дату последнего ответа на вопрос
    const today = new Date().toLocaleDateString();
    localStorage.setItem('lastQuestionDate', today);

    // Объект для хранения прогресса
    let gameProgress = {
        currentQuestionIndex: currentQuestionIndex,
        answeredCorrectly: false // По умолчанию неверный ответ
    };

    if (selectedIndex === correctIndex) {
        mainPoints += levelScore; // Добавляем очки за текущий уровень
        localStorage.setItem('mainPoints', mainPoints); // Сохраняем обновленные очки
        gameProgress.answeredCorrectly = true; // Обновляем статус ответа
        currentQuestionIndex++; // Переходим к следующему вопросу
        saveProgress(currentQuestionIndex); // Сохраняем прогресс

        // Добавляем класс done к текущему вопросу
        updateProgressPage(currentQuestionIndex);

        // Отображаем экран победы
        switchScreen('winPage', false, levelScore);

        if (currentQuestionIndex >= MAX_QUESTIONS_PER_ROUND) {
            resetProgress();
        }
    } else {
        saveProgress(currentQuestionIndex); // Сохраняем прогресс с неправильным ответом
        updateProgressPage(currentQuestionIndex);
        switchScreen('failPage'); // Переход на экран проигрыша
    }
}

// Функция для обновления прогресса на экране progressPage
function updateProgressPage(currentQuestionIndex) {
    const levelItems = document.querySelectorAll('#progressPage .levels .item');

    const currentLevelElement = document.getElementById("currentLevel");
    if (currentLevelElement) {
        currentLevelElement.textContent = `${currentQuestionIndex}/10`;
    }

    levelItems.forEach(item => {
        const levelIndex = parseInt(item.getAttribute('data-level')); // Получаем индекс уровня из data-level
        item.classList.remove('active', 'done'); // Убираем все классы

        if (levelIndex < currentQuestionIndex) {
            item.classList.add('done'); // Добавляем done для пройденных вопросов
        }

        if (levelIndex === currentQuestionIndex) {
            item.classList.add('active'); // Добавляем active для текущего вопроса
        }
    });
}

// Загрузка основных вопросов игры
async function loadQuestions() {
    const response = await fetch('questions.json');
    const questions = await response.json();
    return questions;
}

// DAILY section
// Проверка даты последнего вопроса дня
function checkQuestionOfTheDay() {
    const lastQuestionDate = localStorage.getItem('lastQuestionDate');
    const today = new Date().toLocaleDateString();

    if (lastQuestionDate !== today) {
        showQuestionOfTheDay();
    } else {
        switchScreen('progressPage');
        const scoreValue = document.getElementById("scoreValue");
        if (scoreValue) {
            scoreValue.textContent = `${mainPoints}`;
        }
        showInfoBlock(true, false, true);
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
    showInfoBlock(true, false, false);

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

    showInfoBlock(true, false, false);

    if (selectedIndex === correctIndex) {
        extraPoints += 2; // Добавляем 2 extra points за правильный ответ
        localStorage.setItem('extraPoints', extraPoints); // Сохраняем обновленные extra points
        switchScreen('winPage', true);
    } else {
        switchScreen('failPage');
    }
}

function showInfoBlock(settingsButton, currentLevel, score) {
    const infoBlock = document.getElementById('containerConfig');
    infoBlock.classList.remove('hidden');

    const settingsBlock = document.getElementById('settingsButton');
    const currentLevelBlock = document.getElementById('currentLevel');
    const scoreBlock = document.getElementById('score');

    if (settingsButton) {
        settingsBlock.classList.remove('hidden');
    } else {
        settingsBlock.classList.add('hidden');
    }

    if (currentLevel) {
        currentLevelBlock.classList.remove('hidden');
    } else {
        currentLevelBlock.classList.add('hidden');
    }

    if (score) {
        scoreBlock.classList.remove('hidden');
    } else {
        scoreBlock.classList.add('hidden');
    }
}

export {
    checkQuestionOfTheDay,
    loadQuestions,
    showQuestion,
    startMainGame,
    updateProgressPage,
    loadProgress,
    showInfoBlock
};
