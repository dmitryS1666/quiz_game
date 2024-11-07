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

import {
    failSound,
    runMusic,
    stopMusic,
    tapSound,
    winSound,
    clickSound,
    vibrate
} from './settings'

import {Browser} from "@capacitor/browser";

// читать политику
document.getElementById('readPrivacyPolicy').addEventListener('click', async () => {
    await tapSound.play();

    try {
        await Browser.open({url: 'https://lucky-quizz.site'});
    } catch (e) {
        console.error('Error opening browser:', e);
    }
});
// читать политику
document.getElementById('privacyPolicy').addEventListener('click', async () => {
    await tapSound.play();

    try {
        await Browser.open({url: 'https://lucky-quizz.site'});
    } catch (e) {
        console.error('Error opening browser:', e);
    }
});
// reset game
document.getElementById('resetGame').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);
    localStorage.clear();
    localStorage.setItem('extraPoints', 6);

    // Показать уведомление
    const resetNotification = document.getElementById('resetNotification');
    resetNotification.classList.remove('hidden');

    setTimeout(() => {
        resetNotification.classList.add('hidden');
    }, 1500);
});
document.getElementById('okSettings').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);
    switchScreen('progressPage');
});
document.getElementById('toggle-music').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);
});
document.getElementById('toggle-vibration').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);
});

// reset game
document.getElementById('continueFail').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);
    runMusic();
    switchScreen('progressPage');
});

document.getElementById('close_btn').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

// HITS
document.getElementById('fiftyOnFifty').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);

    let fiftyOnFiftyBtn = document.getElementById('fiftyOnFifty');
    if (fiftyOnFiftyBtn.classList.contains('active')) {
        useHint5050();
    }
});
document.getElementById('call').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);

    let callBtn = document.getElementById('call');
    if (callBtn.classList.contains('active')) {
        useHintFriend();
    }
});
document.getElementById('audience').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);

    let audienceBtn = document.getElementById('audience');
    if (audienceBtn.classList.contains('active')) {
        useHintAudience();
    }
});

document.getElementById('audienceContinue').addEventListener('click', () => {
    tapSound.play();

    switchScreen('questionGame'); // Возвращаемся к экрану вопроса
    showInfoBlock(true, true, true);
});

document.getElementById('continueWin').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);

    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

document.getElementById('useExtraPoints').addEventListener('click', () => {
    tapSound.play();
    runMusic();

    let extraPoints = parseInt(localStorage.getItem('extraPoints')) || 0;
    extraPoints = extraPoints - 2;
    localStorage.setItem('extraPoints', extraPoints);
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

document.getElementById('settingsButton').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);

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
            runMusic();

            let currentQuestionIndex = loadProgress();
            updateProgressPage(currentQuestionIndex);
            showInfoBlock(true, false, true);
        }
        if (screenId === 'winPage') {
            stopMusic();
            showWinPage(isDailyQuestion, levelScore);
            showInfoBlock(true, false, false);
        }
        if (screenId === 'failPage') {
            stopMusic();
            showFailPage();
            showInfoBlock(true, false, false);
        }
        if (screenId === 'finalAnswerPage') {
            stopMusic();
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

    winSound.play();

    if (isDailyQuestion) {
        extraValueElement.classList.remove('hidden');
        valueElement.classList.add('hidden');
        runMusic();
    } else {
        valueElement.innerHTML = `+${levelScore} <img src="res/money_icon.png">`;
        valueElement.classList.remove('hidden');
        extraValueElement.classList.add('hidden');
        runMusic();
    }
}

function showFailPage() {
    failSound.play();
}

function showFinalAnswerPage() {
    failSound.play();
    updateExtraPointsDisplay();
}

// Обработка клика для возобновления игры с текущего вопроса
document.getElementById('progressPage').addEventListener('click', () => {
    clickSound.play();
    vibrate(100);

    startMainGame(); // Возобновляем игру с текущего вопроса
});

export {switchScreen, showPreloader};
