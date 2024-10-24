import { loadSettings } from './settings.js';
import {checkQuestionOfTheDay, lockPortretOrientation} from './game.js';

// Инициализация игры
$(document).ready(() => {
    loadSettings();
    lockPortretOrientation();

    checkQuestionOfTheDay();
});