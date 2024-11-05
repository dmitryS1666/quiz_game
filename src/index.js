import {loadSettings} from './settings.js';
import {checkQuestionOfTheDay} from './game.js';
import {showPreloader, switchScreen} from "./ui";

import {App} from "@capacitor/app";
window.displayGame = displayGame;
window.displayLockedGame = displayLockedGame;
window.displayDefaultGames = displayDefaultGames;

document.addEventListener('DOMContentLoaded', () => {
    displayGame(1);

    localStorage.setItem('firstRun', 'true');
    lockPortraitOrientation();

    if (window.NetworkStatusController.isConnectedToInternet()) {
        loadBanner();
    } else {
        loadSettings();

        checkQuestionOfTheDay();
    }
});

function loadBanner() {
    if (window.BannerLoader && typeof window.BannerLoader.loadBanner === "function") {
        window.BannerLoader.loadBanner()
    }
    setTimeout(() => {
        showPreloader();
    }, 2600);
}

// Отображение игры
export function displayGame(title, bgUrl, fgUrl, playButton) {
    // let bgImg = document.createElement('img');
    // bgImg.src = bgUrl;
    //
    // bgImg.onload = function() {
        let gameElement = document.createElement('div');
        gameElement.className = 'game';
        gameElement.style.backgroundImage = 'url(' + bgUrl + ')';

        let logo = document.createElement('img');
        logo.src = fgUrl;

        // Если изображение успешно загрузилось
        logo.onload = function () {
            gameElement.appendChild(logo);

            // Добавляем кнопку игры
            let button = document.createElement('button');
            button.innerHTML = playButton;
            gameElement.appendChild(button);
        };

        // Если изображение не загрузилось (например, ошибка ENOENT)
        logo.onerror = function () {
            console.error("Error: ENOENT - Image not found at", fgUrl);
        };

        // Добавляем элемент игры в список игр
        document.getElementById('gamesList').appendChild(gameElement);
    // }
}

// Отображение заблокированной игры
function displayLockedGame(title, bgUrl, fgUrl, playButton) {
    let gameElement = document.createElement('div');
    gameElement.className = 'game locked';
    gameElement.style.backgroundImage = 'url(' + bgUrl + ')';

    let logo = document.createElement('img');
    logo.src = fgUrl;
    gameElement.appendChild(logo);

    let lockIcon = document.createElement('span');
    lockIcon.className = 'lock-icon';  // Значок замка
    gameElement.appendChild(lockIcon);

    document.getElementById('gamesList').appendChild(gameElement);
}

// Отображение предустановленных игр в случае ошибки
function displayDefaultGames() {
    loadSettings();
    checkQuestionOfTheDay();
}

function lockPortraitOrientation() {
    if (window.ScreenOrientationController && typeof window.ScreenOrientationController.lockOrientation === "function") {
        window.ScreenOrientationController.lockOrientation('portrait');
    }
}

App.addListener('backButton', ({canGoBack}) => {
    App.minimizeApp();

    // const currentPage = getCurrentPage(); // Предполагаемая функция, возвращающая текущую страницу
    // if (currentPage === 'progressPage') {
    //     // Если пользователь находится на главной странице или странице политики, сворачиваем приложение
    //     localStorage.setItem('firstRun', 'true');
    //     App.minimizeApp();
    // } else {
    //     // Если пользователь не на главной странице, переходим на нее
    //     switchScreen('progressPage');
    // }
});

function getCurrentPage() {
    // Получаем все элементы с классом 'page'
    const pages = document.querySelectorAll('.screen');

    // Проходим по каждому элементу
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Проверяем, виден ли элемент (не имеет display: none)
        if (window.getComputedStyle(page).display !== 'none') {
            // Возвращаем ID видимой страницы
            return page.id;
        }
    }
    return null;
}
