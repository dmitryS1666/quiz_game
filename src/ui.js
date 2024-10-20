document.getElementById('continueWin').addEventListener('click', () => {
    switchScreen('progressPage'); // Переход к экрану основных вопросов
});

function showPreloader() {
    return new Promise((resolve) => {
        $(`#preloaderPage`).fadeIn(500);

        // Задержка в 1.5 секунды (1500 миллисекунд)
        setTimeout(() => {
            $(`#preloaderPage`).fadeOut(500, resolve); // Вызов resolve после завершения fadeOut
        }, 1500);
    });
}

function switchScreen(screenId, isDailyQuestion = false) {
    const screens = document.querySelectorAll('.screen');

    // Скрываем все экраны
    screens.forEach(screen => screen.classList.add('hidden'));

    // Показываем прелоадер
    showPreloader().then(() => {
        // Теперь показываем нужный экран после прелоадера
        const targetScreen = document.getElementById(screenId);
        targetScreen.classList.remove('hidden');

        // Если это winPage, показываем соответствующие значения
        if (screenId === 'winPage') {
            showWinPage(isDailyQuestion);
        }
        if (screenId === 'failPage') {
            showFailPage(isDailyQuestion);
        }
    });
}

function showWinPage(isDailyQuestion) {
    const valueElement = document.getElementById('value');
    const extraValueElement = document.getElementById('extraValue');

    if (isDailyQuestion) {
        extraValueElement.classList.remove('hidden');
        valueElement.classList.add('hidden');
    } else {
        valueElement.classList.remove('hidden');
        extraValueElement.classList.add('hidden');
    }
}

function showFailPage() {
    console.log('fail page');
}

export { switchScreen };
