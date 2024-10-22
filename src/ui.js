import { startMainGame, loadProgress, updateProgressPage, showInfoBlock } from './game.js';

document.getElementById('continueWin').addEventListener('click', () => {
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

function showPreloader() {
    return new Promise((resolve) => {
        $(`#preloaderPage`).fadeIn(500);

        // Задержка в 1.5 секунды (1500 миллисекунд)
        setTimeout(() => {
            $(`#preloaderPage`).fadeOut(500, resolve); // Вызов resolve после завершения fadeOut
        }, 500);
    });
}

function switchScreen(screenId, isDailyQuestion = false, levelScore = 0) {
    const screens = document.querySelectorAll('.screen');
    showInfoBlock(false, false, false);

    // Скрываем все экраны
    screens.forEach(screen => screen.classList.add('hidden'));

    // Показываем прелоадер
    showPreloader().then(() => {
        const targetScreen = document.getElementById(screenId);
        targetScreen.classList.remove('hidden');

        let mainPoints = parseInt(localStorage.getItem('mainPoints')) || 0;
        const scoreValue = document.getElementById("scoreValue");
        scoreValue.textContent = `${mainPoints}`;

        if (screenId === 'progressPage') {
            let currentQuestionIndex = loadProgress();
            updateProgressPage(currentQuestionIndex);
            showInfoBlock(true, false, true);
        }
        if (screenId === 'winPage') {
            showWinPage(isDailyQuestion, levelScore);
            showInfoBlock(true, false, false);
        }
        if (screenId === 'failPage') {
            showFailPage(isDailyQuestion);
            showInfoBlock(true, false, false);
        }
    });
}

function showWinPage(isDailyQuestion, levelScore) {
    const valueElement = document.getElementById('value');
    const extraValueElement = document.getElementById('extraValue');

    if (isDailyQuestion) {
        extraValueElement.classList.remove('hidden');
        valueElement.classList.add('hidden');
    } else {
        valueElement.innerHTML = `+${levelScore} <img src="res/money_icon.png">`;
        valueElement.classList.remove('hidden');
        extraValueElement.classList.add('hidden');
    }
}

function showFailPage() {
    console.log('fail page');
}

// Обработка клика для возобновления игры с текущего вопроса
document.getElementById('progressPage').addEventListener('click', () => {
    startMainGame(); // Возобновляем игру с текущего вопроса
});

export { switchScreen };
