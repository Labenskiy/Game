let currentUser = null;

// Функция для регистрации нового пользователя
async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value; // Получаем пароль
    const wishlist = document.getElementById('wishlist').value;

    // Отправка данных на сервер
    await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, wishlist }), // Отправляем пароль тоже
    });

    currentUser = { username: username, wishlist: wishlist }; // Установите текущего пользователя
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Сохранение в localStorage
    showMainContent();
}

// Функция для входа пользователя
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Здесь должна быть логика проверки логина и пароля
    // Для примера просто создаем текущего пользователя
    currentUser = { username: username };

    // Сохранение информации о пользователе в localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainContent();
}

// Функция для отображения основного контента
function showMainContent() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('chat').classList.remove('hidden');
    document.getElementById('user-nav').classList.remove('hidden');

    // Получение информации о пользователе из localStorage
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        currentUser = savedUser; // Восстановление текущего пользователя
        document.getElementById('user-info').innerHTML = `Привет, ${currentUser.username}!`;
    }
}

// Функция для отображения формы регистрации
function showRegistration() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

// Функция для отображения формы входа
function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('additional-info').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// Функция для отображения формы дополнительной информации
function showAdditionalInfo() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('additional-info').classList.remove('hidden');
}

// Функция для отправки сообщения в чат
function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value;

    if (message.trim() !== "") {
        const chatMessages = document.getElementById("chat-messages");
        const newMessage = document.createElement("div");
        newMessage.textContent = `${currentUser.username}: ${message}`;
        chatMessages.appendChild(newMessage);
        input.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Функция для обновления обратного отсчета времени
function updateCountdown() {
    const endDate = new Date("2024-12-31T23:59:59").getTime(); // указать финальную дату конкурса
    const now = new Date().getTime();
    const timeLeft = endDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("time-left").innerHTML = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
}

// Функция для отображения участников игры
function showParticipants() {
    loadParticipants(); // Загрузите участников при вызове этой функции

    document.getElementById('participants-section').classList.remove('hidden');
    document.getElementById('rules-section').classList.add('hidden');
}

// Функция для загрузки участников с сервера
async function loadParticipants() {
    const response = await fetch('/participants');
    const participants = await response.json();

    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = ''; // Очистка списка

    participants.forEach(participant => {
        const participantCard = document.createElement('div');
        participantCard.classList.add('participant-card');
        participantCard.innerHTML = `
           <h3>${participant.username}</h3>
           <p>Вишлист: ${participant.wishlist}</p>`;
        participantsList.appendChild(participantCard);
    });
}

// Функция для отображения правил игры
function showRules() {
    document.getElementById('rules-section').classList.remove('hidden');
    document.getElementById('participants-section').classList.add('hidden');
}

// Функция для выхода из системы
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser'); // Удаляем данные о пользователе из localStorage
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('chat').classList.add('hidden');
    document.getElementById('user-nav').classList.add('hidden');
}

// При загрузке страницы проверяем наличие пользователя в localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        currentUser = savedUser;
        showMainContent(); // Если пользователь сохранен, показываем основной контент
    }
});

// Обновление обратного отсчета каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown();
