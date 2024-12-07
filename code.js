async function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

async function showRegistration() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showMainContent();
            alert(data.message); // Уведомление об успешном входе
        } else {
            alert(data.error || 'Ошибка при входе');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        alert('Произошла ошибка при входе');
    }
}

async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const wishlist = document.getElementById('wishlist').value.trim();
    const giftLink = document.getElementById('gift-link').value.trim();

    if (!username || !password || !wishlist) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, wishlist, giftLink }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Уведомление об успешной регистрации
            showLogin();
        } else {
            alert(data.error || 'Произошла ошибка при регистрации');
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
    }
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

        // Уведомление о загрузке участников
        alert("Участники загружены!");

        // Инициализация чата
        initializeChat(); // Функция для инициализации чата

        // Загрузка пар Тайного Санты
        loadSantaPairs(); // Функция для загрузки пар Тайного Санты
    } catch (error) {
        console.error("Ошибка при загрузке участников:", error);
        alert("Не удалось загрузить участников.");
    }
}

function showParticipants() {
    document.getElementById("participants-section").classList.remove("hidden");
    document.getElementById("rules-section").classList.add("hidden");
}

function showRules() {
    document.getElementById("participants-section").classList.add("hidden");
    document.getElementById("rules-section").classList.remove("hidden");
}

function logout() {
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("user-nav").classList.add("hidden");
    document.getElementById("auth-container").classList.remove("hidden");
    showLogin();
}

function sendMessage() {
    const messageInput = document.getElementById("chat-input");
    const message = messageInput.value;

    if (message.trim()) {
        // Отправка сообщения на сервер может быть реализована здесь в будущем
        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<p>${message}</p>`;
        messageInput.value = ""; // Очистка поля ввода после отправки сообщения
    }
}

async function generateSantaPairs() {
    try {
        const response = await fetch("/generate-santa-pairs", { method: "POST" });
        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Уведомление об успешной генерации пар
        } else {
            alert(data.error || "Ошибка при генерации пар");
        }
    } catch (error) {
        console.error("Ошибка при генерации пар:", error);
        alert("Произошла ошибка при генерации пар");
    }
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", () => { showLogin(); });
