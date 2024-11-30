const express = require('express');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt'); // Для хэширования паролей

const app = express();
const PORT = process.env.PORT || 3000;

const clientId = 'f7b16acee6de462d97b884db5332b36d';
const clientSecret = 'bd91e91206db4c79afdf24b4b6f5d2ba';
const redirectUri = 'https://labenskiy.github.io/Odyssey/';
let accessToken;

app.use(bodyParser.json()); // Для обработки JSON запросов
app.use(express.static(path.join(__dirname))); // Для обслуживания статических файлов

// Обработка корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Путь к вашему HTML-файлу
});

// Регистрация нового участника
app.post('/register', async (req, res) => {
    const { username, password, wishlist } = req.body; // Получаем данные из запроса

    // Проверка существования файла participants.json
    if (!fs.existsSync('participants.json')) {
        fs.writeFileSync('participants.json', ''); // Создание файла, если он не существует
    }

    // Хэширование пароля перед сохранением
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).send('Ошибка при хэшировании пароля');

        // Сохранение данных в файл
        const userData = { username, password: hash, wishlist }; // Сохраняем хэшированный пароль
        fs.appendFile('participants.json', JSON.stringify(userData) + '\n', (err) => {
            if (err) {
                console.error('Ошибка при сохранении данных:', err);
                return res.status(500).send('Ошибка при сохранении данных');
            }
            res.send('Данные успешно сохранены');
        });
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
