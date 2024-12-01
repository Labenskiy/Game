const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch'); // Убедитесь, что у вас установлен node-fetch
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Обработка регистрации через GitHub OAuth
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: YOUR_CLIENT_ID,
                client_secret: YOUR_CLIENT_SECRET,
                code,
            }),
        });

        const data = await response.json();
        const accessToken = data.access_token;

        if (accessToken) {
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'MyApp/1.0'
                }
            });

            const userData = await userResponse.json();

            // Здесь вы можете сохранить информацию о пользователе и его wishlist
            // Например:
            // const wishlist = req.query.wishlist; // Получите вишлист из запроса
            // Сохраните данные пользователя и wishlist в participants.json или базе данных

            res.send(`Вы успешно зарегистрированы как ${userData.login}!`);
        } else {
            res.status(400).send('Ошибка при получении токена доступа.');
        }
    } catch (error) {
        console.error('Ошибка при получении токена:', error);
        res.status(500).send('Произошла ошибка при регистрации.');
    }
});

app.post('/register', async (req, res) => {
    console.log('Получен запрос на регистрацию:', req.body);
    const { username, password, wishlist, giftLink } = req.body;

    if (!username || !password || !wishlist) {
        return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userData = {
            username,
            password: hashedPassword,
            wishlist,
            giftLink: giftLink || ''
        };

        let participants = [];
        try {
            const data = await fs.readFile('participants.json', 'utf8');
            participants = JSON.parse(data);
        } catch (error) {
            console.log('Файл participants.json не найден или пуст, создаем новый массив');
        }

        participants.push(userData);

        await fs.writeFile('participants.json', JSON.stringify(participants, null, 2));
        console.log('Пользователь успешно зарегистрирован:', username);

        res.status(200).json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Подробная ошибка при регистрации:', error);
        res.status(500).json({ error: `Ошибка при регистрации: ${error.message}` });
    }
});

app.get('/participants', async (req, res) => {
    try {
        const data = await fs.readFile('participants.json', 'utf8');
        const participants = JSON.parse(data);
        const safeParticipants = participants.map(({ username, wishlist }) => ({ username, wishlist }));
        res.json(safeParticipants);
    } catch (error) {
        console.error('Ошибка при чтении данных:', error);
        res.status(500).json({ error: 'Ошибка при чтении данных' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
