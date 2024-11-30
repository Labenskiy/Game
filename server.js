const express = require('express');
const axios = require('axios');
const fs = require('fs'); // Для работы с файловой системой
const bodyParser = require('body-parser');
const path = require('path'); // Для работы с путями

const app = express();
const PORT = process.env.PORT || 3000;

const clientId = 'YOUR_CLIENT_ID'; // Ваш Client ID
const clientSecret = 'YOUR_CLIENT_SECRET'; // Ваш Client Secret
const redirectUri = 'YOUR_REDIRECT_URI'; // Ваш Redirect URI
let accessToken; // Переменная для хранения токена доступа

app.use(bodyParser.json()); // Для обработки JSON запросов
app.use(express.static(path.join(__dirname))); // Для обслуживания статических файлов

// Обработка корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Путь к вашему HTML-файлу
});

// Регистрация нового участника
app.post('/register', async (req, res) => {
    const { username, wishlist } = req.body;

    // Сохранение данных в файл
    const userData = { username, wishlist };
    fs.appendFile('participants.json', JSON.stringify(userData) + '\n', (err) => {
        if (err) {
            console.error('Ошибка при сохранении данных:', err);
            return res.status(500).send('Ошибка при сохранении данных');
        }
        res.send('Данные успешно сохранены');
    });
});

// Получение списка участников
app.get('/participants', (req, res) => {
    // Чтение данных из файла
    fs.readFile('participants.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении данных:', err);
            return res.status(500).send('Ошибка при чтении данных');
        }
        const participants = data.trim().split('\n').map(line => JSON.parse(line));
        res.json(participants);
    });
});

// Аутентификация через Яндекс
app.get('/auth', (req, res) => {
    const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
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

    accessToken = tokenResponse.data.access_token;

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
