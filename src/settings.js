let settings = {
    music: true,
    vibration: true,
};

// Загрузка настроек из LocalStorage
function loadSettings() {
    const storedSettings = JSON.parse(localStorage.getItem('quizSettings'));
    if (storedSettings) {
        settings = storedSettings;
    }

    // document.getElementById('musicToggle').checked = settings.music;
    // document.getElementById('vibrationToggle').checked = settings.vibration;
}

// Сохранение настроек в LocalStorage
function saveSettings() {
    localStorage.setItem('quizSettings', JSON.stringify(settings));
}

// Настройка событий для переключателей
document.getElementById('toggle-music').addEventListener('change', (event) => {
    settings.music = event.target.checked;
    saveSettings();
});

document.getElementById('toggle-vibration').addEventListener('change', (event) => {
    settings.vibration = event.target.checked;
    saveSettings();
});

export { settings, loadSettings, saveSettings };
