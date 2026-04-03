// Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
}

// Данные игр
const games = {
    pixel: {
        storageKey: 'game_pixel_score',
        scoreElem: 'score-pixel',
        previewElem: 'preview-pixel',
        clickId: 'click-pixel',
        refLink: 'https://t.me/pixelworld/play?startapp=r6823288584',
        refInputId: 'ref-link-pixel',
        refBtnId: 'ref-pixel-btn'
    },
    hamster: {
        storageKey: 'game_hamster_score',
        scoreElem: 'score-hamster',
        previewElem: 'preview-hamster',
        clickId: 'click-hamster',
        refLink: 'https://t.me/Hamster_GAme_Dev_bot/start?startapp=kentId6823288584',
        refInputId: 'ref-link-hamster',
        refBtnId: 'ref-hamster-btn'
    }
};

let scores = {
    pixel: 0,
    hamster: 0
};

// Загрузка сохранённых очков
function loadScores() {
    for (const [key, game] of Object.entries(games)) {
        const saved = localStorage.getItem(game.storageKey);
        scores[key] = saved ? parseInt(saved) : 0;
        updateScoreUI(key);
        updatePreview(key);
    }
}

function saveScore(key) {
    localStorage.setItem(games[key].storageKey, scores[key]);
}

function updateScoreUI(key) {
    const elem = document.getElementById(games[key].scoreElem);
    if (elem) elem.innerText = scores[key];
}

function updatePreview(key) {
    const elem = document.getElementById(games[key].previewElem);
    if (elem) elem.innerText = scores[key];
}

// Анимация "+1" в месте клика
function showFloatingPlus(x, y) {
    const div = document.createElement('div');
    div.className = 'floating-plus';
    div.innerText = '+1';
    div.style.left = `${x - 20}px`;
    div.style.top = `${y - 25}px`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 600);
}

// Настройка кликов по игровой зоне
function setupClickHandler(key) {
    const zone = document.getElementById(games[key].clickId);
    if (!zone) return;

    const handler = (e) => {
        scores[key]++;
        updateScoreUI(key);
        updatePreview(key);
        saveScore(key);

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        showFloatingPlus(clientX, clientY);

        if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        else if (navigator.vibrate) navigator.vibrate(30);

        e.preventDefault();
    };

    zone.addEventListener('click', handler);
    zone.addEventListener('touchstart', handler, { passive: false });
}

// Реферальные ссылки: открытие и копирование
function setupReferral(key) {
    const game = games[key];
    const refBtn = document.getElementById(game.refBtnId);
    const copyBtn = document.querySelector(`[data-copy="${game.refInputId}"]`);
    const linkInput = document.getElementById(game.refInputId);

    if (refBtn) {
        refBtn.addEventListener('click', () => {
            if (tg && tg.openTelegramLink) tg.openTelegramLink(game.refLink);
            else window.open(game.refLink, '_blank');
        });
    }

    if (copyBtn && linkInput) {
        copyBtn.addEventListener('click', () => {
            linkInput.select();
            linkInput.setSelectionRange(0, 99999);
            document.execCommand('copy');
            const original = copyBtn.innerText;
            copyBtn.innerText = '✅ Скопировано!';
            setTimeout(() => { copyBtn.innerText = original; }, 1500);
            if (tg && tg.showPopup) tg.showPopup({ message: 'Ссылка скопирована!', buttons: [{ type: 'ok' }] });
        });
    }
}

// Навигация между экранами
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Инициализация главного меню
function initHome() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const game = card.getAttribute('data-game');
            if (game === 'pixel') switchScreen('pixel');
            else if (game === 'hamster') switchScreen('hamster');
        });
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => switchScreen('home'));
    });
}

// Запуск приложения
function init() {
    loadScores();
    setupClickHandler('pixel');
    setupClickHandler('hamster');
    setupReferral('pixel');
    setupReferral('hamster');
    initHome();
    switchScreen('home');

    if (tg) {
        tg.setHeaderColor?.('bg_color');
        tg.setBackgroundColor?.('bg_color');
    }
}

document.addEventListener('DOMContentLoaded', init);
