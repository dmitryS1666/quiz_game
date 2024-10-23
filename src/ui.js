import {
    startMainGame,
    loadProgress,
    updateProgressPage,
    showInfoBlock,
    timer,
    updateExtraPointsDisplay,
    useHint5050,
    useHintFriend,
    useHintAudience
} from './game.js';

// reset game
document.getElementById('resetGame').addEventListener('click', () => {
    localStorage.clear();
});

// reset game
document.getElementById('continueFail').addEventListener('click', () => {
    switchScreen('progressPage');
});

document.getElementById('close_btn').addEventListener('click', () => {
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

// HITS
document.getElementById('fiftyOnFifty').addEventListener('click', () => {
    let fiftyOnFiftyBtn = document.getElementById('fiftyOnFifty');
    if (fiftyOnFiftyBtn.classList.contains('active')) {
        useHint5050();
    }
});
document.getElementById('call').addEventListener('click', () => {
    let callBtn = document.getElementById('call');
    if (callBtn.classList.contains('active')) {
        useHintFriend();
    }
});
document.getElementById('audience').addEventListener('click', () => {
    let audienceBtn = document.getElementById('audience');
    if (audienceBtn.classList.contains('active')) {
        useHintAudience();
    }
});

document.getElementById('audienceContinue').addEventListener('click', () => {
    switchScreen('questionGame'); // Возвращаемся к экрану вопроса
    showInfoBlock(true, true, true);
});


document.getElementById('continueWin').addEventListener('click', () => {
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

document.getElementById('useExtraPoints').addEventListener('click', () => {
    let extraPoints = parseInt(localStorage.getItem('extraPoints')) || 0;
    extraPoints = extraPoints - 2;
    localStorage.setItem('extraPoints', extraPoints);
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

document.getElementById('settingsButton').addEventListener('click', () => {
    clearInterval(timer); // Очищаем таймер при выборе ответа
    switchScreen('settings'); // Переход к экрану основных вопросов
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
        if (screenId === 'finalAnswerPage') {
            showFinalAnswerPage();
            showInfoBlock(true, false, false);
        }
        if (screenId === 'audienceHintPage') {
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

function showFinalAnswerPage() {
    updateExtraPointsDisplay();
}

// Обработка клика для возобновления игры с текущего вопроса
document.getElementById('progressPage').addEventListener('click', () => {
    startMainGame(); // Возобновляем игру с текущего вопроса
});

export { switchScreen };
