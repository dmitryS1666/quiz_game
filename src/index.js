import { loadSettings } from './settings.js';
import { checkQuestionOfTheDay } from './game.js';

// Инициализация игры
$(document).ready(() => {
    loadSettings();

    checkQuestionOfTheDay();
});