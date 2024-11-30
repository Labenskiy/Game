let currentUser = null;
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001; // Измените на 3001 или другой свободный порт

const clientId = 'f7b16acee6de462d97b884db5332b36d'; //
const clientSecret = 'bd91e91206db4c79afdf24b4b6f5d2ba';
const redirectUri = 'https://labenskiy.github.io/Odyssey/';

app.get('/auth', (req, res) => {
    const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
});

app.post('/upload', async (req, res) => {
    const fileData = req.body; // Получаем данные файла из запроса
    const uploadUrlResponse = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/upload?path=path/to/your/file.txt&fields=href', {
        headers: {
            Authorization: `OAuth ${accessToken}`,
        },
    });

    const uploadUrl = uploadUrlResponse.data.href;

    await axios.put(uploadUrl, fileData); // Загружаем файл по полученному URL
    res.send('File uploaded successfully!');
});


app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const tokenResponse = await axios.post('https://oauth.yandex.ru/token', null, {
        params: {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
        },
    });

    const accessToken = tokenResponse.data.access_token;

    // Теперь вы можете использовать accessToken для доступа к Яндекс Диску
    const filesResponse = await axios.get('https://cloud-api.yandex.net/v1/disk/resources/files', {
        headers: {
            Authorization: `OAuth ${accessToken}`,
        },
    });

    res.json(filesResponse.data); // Отправляем список файлов обратно клиенту
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Список участников (в реальном приложении будет загружаться с сервера) @microsoft/microsoft-graph-client
const participants = [
    {
        username: "Иван К.",
        avatar: "avatar1.jpg",
        wishlist: "Хочу книгу о кино"
    },
    {
        username: "Анна М.",
        avatar: "avatar2.jpg",
        wishlist: "Постер любимого фильма"
    }
    // Можно добавить больше участников, через @microsoft/microsoft-graph-client
];

function showRegistration() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('additional-info').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function showAdditionalInfo() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('additional-info').classList.remove('hidden');
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    // Здесь должна быть логика проверки логина и пароля
    currentUser = {username: username};
    showMainContent();
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const wishlist = document.getElementById('wishlist').value;
    const giftLink = document.getElementById('gift-link').value;
    const avatar = document.getElementById('avatar').files[0];
    // Здесь должна быть логика регистрации пользователя
    currentUser = {username: username, wishlist: wishlist, giftLink: giftLink};
    showMainContent();
}

function showMainContent() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('chat').classList.remove('hidden');
    document.getElementById('user-nav').classList.remove('hidden');
    document.getElementById('user-info').innerHTML = `Привет, ${currentUser.username}!`;
    // Здесь можно добавить логику загрузки данных пользователя и назначения Санты
}

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

function showParticipants() {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = ''; // Очистка списка

    participants.forEach(participant => {
        const participantCard = document.createElement('div');
        participantCard.classList.add('participant-card');
        participantCard.innerHTML = `
            <img src="${participant.avatar}" alt="${participant.username}">
            <h3>${participant.username}</h3>
            <p>Вишлист: ${participant.wishlist}</p>
        `;
        participantsList.appendChild(participantCard);
    });

    document.getElementById('participants-section').classList.remove('hidden');
    document.getElementById('rules-section').classList.add('hidden');
}

function showRules() {
    document.getElementById('rules-section').classList.remove('hidden');
    document.getElementById('participants-section').classList.add('hidden');
}

function logout() {
    currentUser = null;
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('chat').classList.add('hidden');
    document.getElementById('user-nav').classList.add('hidden');
}

setInterval(updateCountdown, 1000);
updateCountdown();
