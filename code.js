function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('additional-info').classList.add('hidden');
}

function showRegistration() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('additional-info').classList.add('hidden');
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Попытка входа:', username);
    showMainContent();
}

// Обновленная функция регистрации с использованием OAuth
async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const wishlist = document.getElementById('wishlist').value.trim();
    const giftLink = document.getElementById('gift-link').value.trim();

    // Проверка на заполненность обязательных полей
    if (!username) {
        alert('Пожалуйста, введите логин.');
        return;
    }
    if (!password) {
        alert('Пожалуйста, введите пароль.');
        return;
    }
    if (!wishlist) {
        alert('Пожалуйста, заполните вишлист.');
        return;
    }

    // URL для авторизации с указанием scopes
    const authUrl = `/`;

    // Перенаправляем пользователя на страницу авторизации
    window.location.href = authUrl;

    // После успешной авторизации GitHub перенаправит пользователя обратно на ваш callback URL
}

function showMainContent() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('user-nav').classList.remove('hidden');
    loadParticipants();
}

async function loadParticipants() {
    try {
        const response = await fetch('/participants');
        const participants = await response.json();
        const participantsList = document.getElementById('participants-list');
        participantsList.innerHTML = '';
        participants.forEach(participant => {
            const participantCard = document.createElement('div');
            participantCard.classList.add('participant-card');
            participantCard.innerHTML = `
                 <h3>${participant.username}</h3>
                 <p>Вишлист: ${participant.wishlist}</p>`;
            participantsList.appendChild(participantCard);
        });
    } catch (error) {
        console.error('Ошибка при загрузке участников:', error);
    }
}

function showParticipants() {
    document.getElementById('participants-section').classList.remove('hidden');
    document.getElementById('rules-section').classList.add('hidden');
}

function showRules() {
    document.getElementById('participants-section').classList.add('hidden');
    document.getElementById('rules-section').classList.remove('hidden');
}

function logout() {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('user-nav').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    showLogin();
}

function sendMessage() {
    const messageInput = document.getElementById("chat-input");
    const message = messageInput.value;
    if (message.trim()) {
        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<p>${message}</p>`;
        messageInput.value = "";
    }
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", () => { showLogin(); });
